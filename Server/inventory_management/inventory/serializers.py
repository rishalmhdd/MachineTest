from rest_framework import serializers
from .models import Products, Variant, SubVariant, ProductVariantCombination, StockTransaction

class SubVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubVariant
        fields = ['id', 'value']

    def to_internal_value(self, data):
        if isinstance(data, str):
            return super().to_internal_value({'value': data})
        return super().to_internal_value(data)


class VariantSerializer(serializers.ModelSerializer):
    options = SubVariantSerializer(many=True)

    class Meta:
        model = Variant
        fields = ['id', 'name', 'options']

class ProductCreateSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True)  # maps to ProductName
    variants = VariantSerializer(many=True)

    class Meta:
        model = Products
        fields = ['name', 'ProductImage', 'variants']

    def create(self, validated_data):
        import random
        from django.contrib.auth.models import User

        name = validated_data.pop('name')
        variants_data = validated_data.pop('variants')

        # Use superuser or fallback to first available user
        user = User.objects.filter(is_superuser=True).first()
        if not user:
            user = User.objects.first()

        if not user:
            raise serializers.ValidationError("No user exists to assign as CreatedUser.")

        product = Products.objects.create(
            ProductName=name,
            ProductID=random.randint(100000, 999999),
            ProductCode=f"PRD{random.randint(1000, 9999)}",
            CreatedUser=user,
            **validated_data
        )

        for variant_data in variants_data:
            options = variant_data.pop('options')
            variant = Variant.objects.create(product=product, **variant_data)
            for opt in options:
                SubVariant.objects.create(variant=variant, **opt)

        return product

class ProductListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Products
        fields = ['id', 'ProductID', 'ProductName', 'ProductCode', 'TotalStock']

class StockTransactionSerializer(serializers.Serializer):
    product_id = serializers.UUIDField()
    combination = serializers.JSONField()
    quantity = serializers.DecimalField(max_digits=20, decimal_places=8)

class StockReportSerializer(serializers.ModelSerializer):
    product_variant = serializers.StringRelatedField()

    class Meta:
        model = StockTransaction
        fields = '__all__'
