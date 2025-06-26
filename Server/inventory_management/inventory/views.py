from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from .models import *
from .serializers import *
from django.utils.dateparse import parse_datetime
from django.db.models import Q
from rest_framework.pagination import PageNumberPagination
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from django.db import transaction
import logging

logger = logging.getLogger(__name__)

class CreateProductView(generics.CreateAPIView):
    serializer_class = ProductCreateSerializer

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class ProductListView(ListAPIView):
    queryset = Products.objects.filter(Active=True).order_by('-CreatedDate')
    serializer_class = ProductListSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['ProductName', 'ProductCode']
    ordering_fields = ['CreatedDate', 'ProductName']
class AddStockAPIView(APIView):
    def post(self, request):
        serializer = StockTransactionSerializer(data=request.data)
        if serializer.is_valid(): 
            product_id = serializer.validated_data['product_id']
            combination = serializer.validated_data['combination']
            quantity = serializer.validated_data['quantity']

            product = get_object_or_404(Products, id=product_id)
            keys = []

            for variant_name, option_value in combination.items():
                try:
                    variant = Variant.objects.get(product=product, name=variant_name)
                    subvariant = SubVariant.objects.get(variant=variant, value=option_value)
                    keys.append(str(subvariant.id))
                except Variant.DoesNotExist:
                    return Response({"error": f"Variant '{variant_name}' not found"}, status=400)
                except SubVariant.DoesNotExist:
                    return Response({"error": f"Option '{option_value}' not found for variant '{variant_name}'"}, status=400)

            combination_key = "-".join(sorted(keys))  # string key from subvariant IDs

            with transaction.atomic():
                combination_obj, created = ProductVariantCombination.objects.get_or_create(
                    product=product,
                    combination=combination_key,  # Make sure your model uses CharField
                    defaults={"stock": quantity}
                )
                if not created:
                    combination_obj.stock += quantity
                    combination_obj.save()

                product.TotalStock += quantity
                product.save()

                StockTransaction.objects.create(
                    product=product,
                    product_variant=combination_obj,
                    quantity=quantity,
                    transaction_type='IN'
                )

            return Response({"message": "Stock added successfully"}, status=201)

        return Response(serializer.errors, status=400)

class RemoveStockAPIView(APIView):
    def post(self, request):
        serializer = StockTransactionSerializer(data=request.data)
        if serializer.is_valid():
            product_id = serializer.validated_data['product_id']
            combination = serializer.validated_data['combination']
            quantity = serializer.validated_data['quantity']

            product = get_object_or_404(Products, id=product_id)
            keys = []

            for variant_name, option_value in combination.items():
                try:
                    variant = Variant.objects.get(product=product, name=variant_name)
                    subvariant = SubVariant.objects.get(variant=variant, value=option_value)
                    keys.append(str(subvariant.id))
                except (Variant.DoesNotExist, SubVariant.DoesNotExist):
                    return Response({"error": f"Invalid variant/option: {variant_name} - {option_value}"}, status=400)

            combination_key = "-".join(sorted(keys))

            try:
                combination_obj = ProductVariantCombination.objects.get(product=product, combination=combination_key)
            except ProductVariantCombination.DoesNotExist:
                return Response({"error": "Combination not found"}, status=404)

            if combination_obj.stock < quantity:
                return Response({"error": "Not enough stock to remove"}, status=400)

            with transaction.atomic():
                combination_obj.stock -= quantity
                combination_obj.save()

                product.TotalStock -= quantity
                product.save()

                StockTransaction.objects.create(
                    product=product,
                    product_variant=combination_obj,
                    quantity=quantity,
                    transaction_type='OUT'
                )

            return Response({"message": "Stock removed successfully"}, status=200)

        return Response(serializer.errors, status=400)

class StockReportAPIView(generics.ListAPIView):
    serializer_class = StockReportSerializer

    def get_queryset(self):
        queryset = StockTransaction.objects.select_related('product', 'product_variant').all()
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')

        if start_date:
            queryset = queryset.filter(created_at__date__gte=start_date)
        if end_date:
            queryset = queryset.filter(created_at__date__lte=end_date)

        return queryset.order_by('-created_at')


