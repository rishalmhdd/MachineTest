from django.urls import path
from .views import *

urlpatterns = [
    path('products/create/', CreateProductView.as_view()),
    path('products/', ProductListView.as_view(), name='product-list'),
    path('stock/add/', AddStockAPIView.as_view(), name='stock-add'),
    path('stock/remove/', RemoveStockAPIView.as_view()),
    path('stock/report/', StockReportAPIView.as_view()),


 ]