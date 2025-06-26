
from django.db import models
from django.contrib.auth.models import User
from versatileimagefield.fields import VersatileImageField
import uuid
from django.db import models
from django.utils.translation import gettext_lazy as _
from versatileimagefield.fields import VersatileImageField

class Products(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ProductID = models.BigIntegerField(unique=True)
    ProductCode = models.CharField(max_length=255, unique=True)
    ProductName = models.CharField(max_length=255)
    ProductImage = VersatileImageField(upload_to="uploads/", blank=True, null=True)
    CreatedDate = models.DateTimeField(auto_now_add=True)
    UpdatedDate = models.DateTimeField(blank=True, null=True)
    CreatedUser = models.ForeignKey("auth.User", related_name="user%(class)s_objects", on_delete=models.CASCADE)
    IsFavourite = models.BooleanField(default=False)
    Active = models.BooleanField(default=True)
    HSNCode = models.CharField(max_length=255, blank=True, null=True)
    TotalStock = models.DecimalField(default=0.00, max_digits=20, decimal_places=8, blank=True, null=True)

    class Meta:
        db_table = "products_product"
        verbose_name = _("product")
        verbose_name_plural = _("products")
        unique_together = (("ProductCode", "ProductID"),)
        ordering = ("-CreatedDate", "ProductID")

    

class Variant(models.Model):
    product = models.ForeignKey(Products, related_name='variants', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class SubVariant(models.Model):
    variant = models.ForeignKey(Variant, related_name='options', on_delete=models.CASCADE)
    value = models.CharField(max_length=100)

    def __str__(self):
        return self.value


class ProductVariantCombination(models.Model):
    product = models.ForeignKey(Products, on_delete=models.CASCADE)
    combination = models.CharField(max_length=255)  # ← Use CharField instead of JSONField
    stock = models.DecimalField(default=0.00, max_digits=20, decimal_places=8)

    def __str__(self):
        return f"{self.product.ProductName} - {self.combination}"


class StockTransaction(models.Model):
    product = models.ForeignKey(Products, on_delete=models.CASCADE)
    product_variant = models.ForeignKey(ProductVariantCombination, on_delete=models.CASCADE)
    transaction_type = models.CharField(choices=[('IN', 'Stock In'), ('OUT', 'Stock Out')], max_length=3)
    quantity = models.DecimalField(max_digits=20, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
