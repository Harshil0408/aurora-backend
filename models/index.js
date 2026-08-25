const { Op, QueryTypes } = require('sequelize');
const Sequelize = require('sequelize');
const sequelize = require('../database');
const UserModel = require('./user.models');
const AdminUserModel = require('./admin_user.models');
const SellerUserModel = require('./seller_users.model');
const UserProfileModel = require('./user_profile.models');
const AddressModel = require('./address.model');
const CategoryModel = require('./category.model');
const BrandModel = require('./brand.model');
const ProductModel = require('./product.model');
const ProductImageModel = require('./product_image.model');
const ProductVariantModel = require('./product_variant.model');
const ReviewModel = require('./review.model');
const CouponModel = require('./coupon.model');
const CartModel = require('./cart.model');
const CartItemModel = require('./cart_item.model');
const WishlistModel = require('./wishlist.model');
const WishlistItemModel = require('./wishlist_item.model');
const OrderModel = require('./order.model');
const OrderItemModel = require('./order_item.model');
const PaymentModel = require('./payment.model');

// User relations
UserModel.hasOne(UserProfileModel, {
  foreignKey: 'user_id',
  as: 'userProfile',
});

UserProfileModel.belongsTo(UserModel, {
  foreignKey: 'user_id',
  as: 'user',
});

UserModel.hasMany(AddressModel, {
  foreignKey: 'user_id',
  as: 'addresses',
});

AddressModel.belongsTo(UserModel, {
  foreignKey: 'user_id',
  as: 'user',
});

UserModel.hasOne(SellerUserModel, {
  foreignKey: 'user_id',
  as: 'sellerAccount',
});

SellerUserModel.belongsTo(UserModel, {
  foreignKey: 'user_id',
  as: 'user',
});

UserModel.hasOne(AdminUserModel, {
  foreignKey: 'user_id',
  as: 'adminAccount',
});

AdminUserModel.belongsTo(UserModel, {
  foreignKey: 'user_id',
  as: 'user',
});

UserModel.hasOne(CartModel, {
  foreignKey: 'user_id',
  as: 'cart',
});

CartModel.belongsTo(UserModel, {
  foreignKey: 'user_id',
  as: 'user',
});

UserModel.hasOne(WishlistModel, {
  foreignKey: 'user_id',
  as: 'wishlist',
});

WishlistModel.belongsTo(UserModel, {
  foreignKey: 'user_id',
  as: 'user',
});

UserModel.hasMany(OrderModel, {
  foreignKey: 'user_id',
  as: 'orders',
});

OrderModel.belongsTo(UserModel, {
  foreignKey: 'user_id',
  as: 'user',
});

UserModel.hasMany(ReviewModel, {
  foreignKey: 'user_id',
  as: 'reviews',
});

ReviewModel.belongsTo(UserModel, {
  foreignKey: 'user_id',
  as: 'user',
});

UserModel.hasMany(PaymentModel, {
  foreignKey: 'user_id',
  as: 'payments',
});

PaymentModel.belongsTo(UserModel, {
  foreignKey: 'user_id',
  as: 'user',
});

// Category self relation (nested categories)
CategoryModel.hasMany(CategoryModel, {
  foreignKey: 'parent_id',
  as: 'subCategories',
});

CategoryModel.belongsTo(CategoryModel, {
  foreignKey: 'parent_id',
  as: 'parentCategory',
});

// Catalog relations
CategoryModel.hasMany(ProductModel, {
  foreignKey: 'category_id',
  as: 'products',
});

ProductModel.belongsTo(CategoryModel, {
  foreignKey: 'category_id',
  as: 'category',
});

BrandModel.hasMany(ProductModel, {
  foreignKey: 'brand_id',
  as: 'products',
});

ProductModel.belongsTo(BrandModel, {
  foreignKey: 'brand_id',
  as: 'brand',
});

SellerUserModel.hasMany(ProductModel, {
  foreignKey: 'seller_user_id',
  as: 'products',
});

ProductModel.belongsTo(SellerUserModel, {
  foreignKey: 'seller_user_id',
  as: 'seller',
});

ProductModel.hasMany(ProductImageModel, {
  foreignKey: 'product_id',
  as: 'images',
});

ProductImageModel.belongsTo(ProductModel, {
  foreignKey: 'product_id',
  as: 'product',
});

ProductModel.hasMany(ProductVariantModel, {
  foreignKey: 'product_id',
  as: 'variants',
});

ProductVariantModel.belongsTo(ProductModel, {
  foreignKey: 'product_id',
  as: 'product',
});

ProductModel.hasMany(ReviewModel, {
  foreignKey: 'product_id',
  as: 'reviews',
});

ReviewModel.belongsTo(ProductModel, {
  foreignKey: 'product_id',
  as: 'product',
});

// Cart relations
CartModel.hasMany(CartItemModel, {
  foreignKey: 'cart_id',
  as: 'cartItems',
});

CartItemModel.belongsTo(CartModel, {
  foreignKey: 'cart_id',
  as: 'cart',
});

CartModel.belongsTo(CouponModel, {
  foreignKey: 'coupon_id',
  as: 'coupon',
});

CartItemModel.belongsTo(ProductModel, {
  foreignKey: 'product_id',
  as: 'product',
});

CartItemModel.belongsTo(ProductVariantModel, {
  foreignKey: 'variant_id',
  as: 'variant',
});

// Wishlist relations
WishlistModel.hasMany(WishlistItemModel, {
  foreignKey: 'wishlist_id',
  as: 'wishlistItems',
});

WishlistItemModel.belongsTo(WishlistModel, {
  foreignKey: 'wishlist_id',
  as: 'wishlist',
});

WishlistItemModel.belongsTo(ProductModel, {
  foreignKey: 'product_id',
  as: 'product',
});

// Order relations
CouponModel.hasMany(OrderModel, {
  foreignKey: 'coupon_id',
  as: 'orders',
});

OrderModel.belongsTo(CouponModel, {
  foreignKey: 'coupon_id',
  as: 'coupon',
});

OrderModel.hasMany(OrderItemModel, {
  foreignKey: 'order_id',
  as: 'orderItems',
});

OrderItemModel.belongsTo(OrderModel, {
  foreignKey: 'order_id',
  as: 'order',
});

OrderModel.hasMany(PaymentModel, {
  foreignKey: 'order_id',
  as: 'payments',
});

PaymentModel.belongsTo(OrderModel, {
  foreignKey: 'order_id',
  as: 'order',
});

OrderItemModel.belongsTo(ProductModel, {
  foreignKey: 'product_id',
  as: 'product',
});

OrderItemModel.belongsTo(ProductVariantModel, {
  foreignKey: 'variant_id',
  as: 'variant',
});

OrderItemModel.belongsTo(SellerUserModel, {
  foreignKey: 'seller_user_id',
  as: 'seller',
});

module.exports = {
  user: UserModel,
  adminUser: AdminUserModel,
  sellerUser: SellerUserModel,
  userProfile: UserProfileModel,
  address: AddressModel,
  category: CategoryModel,
  brand: BrandModel,
  product: ProductModel,
  productImage: ProductImageModel,
  productVariant: ProductVariantModel,
  review: ReviewModel,
  coupon: CouponModel,
  cart: CartModel,
  cartItem: CartItemModel,
  wishlist: WishlistModel,
  wishlistItem: WishlistItemModel,
  order: OrderModel,
  orderItem: OrderItemModel,
  payment: PaymentModel,
  QueryTypes,
  sequelize,
  Sequelize,
  Op,
};
