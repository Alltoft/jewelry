"""empty message

Revision ID: 25acc88433f0
Revises: 
Create Date: 2024-11-21 14:42:08.661339

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '25acc88433f0'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user',
    sa.Column('user_id', sa.String(length=64), nullable=False),
    sa.Column('name', sa.String(length=64), nullable=True),
    sa.Column('lastname', sa.String(length=64), nullable=True),
    sa.Column('username', sa.String(length=64), nullable=True),
    sa.Column('email', sa.String(length=120), nullable=True),
    sa.Column('password_hash', sa.String(length=128), nullable=True),
    sa.Column('user_role', sa.Enum('Seller', 'Customer'), nullable=True),
    sa.Column('phone_number', sa.String(length=64), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.Column('deleted_at', sa.DateTime(), nullable=True),
    sa.Column('last_login', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('user_id')
    )
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_user_created_at'), ['created_at'], unique=False)
        batch_op.create_index(batch_op.f('ix_user_deleted_at'), ['deleted_at'], unique=False)
        batch_op.create_index(batch_op.f('ix_user_email'), ['email'], unique=True)
        batch_op.create_index(batch_op.f('ix_user_last_login'), ['last_login'], unique=False)
        batch_op.create_index(batch_op.f('ix_user_lastname'), ['lastname'], unique=False)
        batch_op.create_index(batch_op.f('ix_user_name'), ['name'], unique=False)
        batch_op.create_index(batch_op.f('ix_user_phone_number'), ['phone_number'], unique=False)
        batch_op.create_index(batch_op.f('ix_user_updated_at'), ['updated_at'], unique=False)
        batch_op.create_index(batch_op.f('ix_user_user_role'), ['user_role'], unique=False)
        batch_op.create_index(batch_op.f('ix_user_username'), ['username'], unique=True)

    op.create_table('customer',
    sa.Column('customer_id', sa.String(length=64), nullable=False),
    sa.Column('user_id', sa.String(length=64), nullable=True),
    sa.Column('bank_details', sa.String(length=64), nullable=True),
    sa.Column('shipping_address', sa.String(length=64), nullable=True),
    sa.Column('brith_date', sa.DateTime(), nullable=True),
    sa.Column('phone_number', sa.String(length=64), nullable=True),
    sa.Column('gender', sa.Enum('Male', 'Female'), nullable=True),
    sa.Column('jewelery_preference', sa.String(length=64), nullable=True),
    sa.Column('total_purchases', sa.Integer(), nullable=True),
    sa.Column('total_spent', sa.Float(), nullable=True),
    sa.Column('payment_method', sa.Enum('Credit Card', 'Debit Card', 'Paypal'), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.Column('deleted_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.user_id'], ),
    sa.PrimaryKeyConstraint('customer_id'),
    sa.UniqueConstraint('user_id')
    )
    with op.batch_alter_table('customer', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_customer_bank_details'), ['bank_details'], unique=False)
        batch_op.create_index(batch_op.f('ix_customer_brith_date'), ['brith_date'], unique=False)
        batch_op.create_index(batch_op.f('ix_customer_created_at'), ['created_at'], unique=False)
        batch_op.create_index(batch_op.f('ix_customer_deleted_at'), ['deleted_at'], unique=False)
        batch_op.create_index(batch_op.f('ix_customer_gender'), ['gender'], unique=False)
        batch_op.create_index(batch_op.f('ix_customer_jewelery_preference'), ['jewelery_preference'], unique=False)
        batch_op.create_index(batch_op.f('ix_customer_payment_method'), ['payment_method'], unique=False)
        batch_op.create_index(batch_op.f('ix_customer_phone_number'), ['phone_number'], unique=False)
        batch_op.create_index(batch_op.f('ix_customer_shipping_address'), ['shipping_address'], unique=False)
        batch_op.create_index(batch_op.f('ix_customer_total_purchases'), ['total_purchases'], unique=False)
        batch_op.create_index(batch_op.f('ix_customer_total_spent'), ['total_spent'], unique=False)
        batch_op.create_index(batch_op.f('ix_customer_updated_at'), ['updated_at'], unique=False)

    op.create_table('seller',
    sa.Column('seller_id', sa.String(length=64), nullable=False),
    sa.Column('user_id', sa.String(length=64), nullable=True),
    sa.Column('store_name', sa.String(length=64), nullable=True),
    sa.Column('address', sa.String(length=64), nullable=True),
    sa.Column('store_description', sa.String(length=120), nullable=True),
    sa.Column('license_number', sa.String(length=64), nullable=True),
    sa.Column('bank_account', sa.String(length=64), nullable=True),
    sa.Column('phone_number', sa.String(length=64), nullable=True),
    sa.Column('seller_status', sa.Enum('Active', 'Inactive'), nullable=True),
    sa.Column('is_verified', sa.Boolean(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.Column('deleted_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.user_id'], ),
    sa.PrimaryKeyConstraint('seller_id'),
    sa.UniqueConstraint('user_id')
    )
    with op.batch_alter_table('seller', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_seller_address'), ['address'], unique=False)
        batch_op.create_index(batch_op.f('ix_seller_bank_account'), ['bank_account'], unique=False)
        batch_op.create_index(batch_op.f('ix_seller_created_at'), ['created_at'], unique=False)
        batch_op.create_index(batch_op.f('ix_seller_deleted_at'), ['deleted_at'], unique=False)
        batch_op.create_index(batch_op.f('ix_seller_is_verified'), ['is_verified'], unique=False)
        batch_op.create_index(batch_op.f('ix_seller_license_number'), ['license_number'], unique=False)
        batch_op.create_index(batch_op.f('ix_seller_phone_number'), ['phone_number'], unique=False)
        batch_op.create_index(batch_op.f('ix_seller_seller_status'), ['seller_status'], unique=False)
        batch_op.create_index(batch_op.f('ix_seller_store_description'), ['store_description'], unique=False)
        batch_op.create_index(batch_op.f('ix_seller_store_name'), ['store_name'], unique=False)
        batch_op.create_index(batch_op.f('ix_seller_updated_at'), ['updated_at'], unique=False)

    op.create_table('order',
    sa.Column('order_id', sa.String(length=64), nullable=False),
    sa.Column('customer_id', sa.String(length=64), nullable=True),
    sa.Column('order_date', sa.DateTime(), nullable=True),
    sa.Column('order_status', sa.Enum('Pending', 'Delivered', 'Cancelled'), nullable=True),
    sa.Column('total_price', sa.Float(), nullable=True),
    sa.Column('total_quantity', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.Column('deleted_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['customer_id'], ['customer.customer_id'], ),
    sa.PrimaryKeyConstraint('order_id')
    )
    with op.batch_alter_table('order', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_order_created_at'), ['created_at'], unique=False)
        batch_op.create_index(batch_op.f('ix_order_deleted_at'), ['deleted_at'], unique=False)
        batch_op.create_index(batch_op.f('ix_order_order_date'), ['order_date'], unique=False)
        batch_op.create_index(batch_op.f('ix_order_order_status'), ['order_status'], unique=False)
        batch_op.create_index(batch_op.f('ix_order_total_price'), ['total_price'], unique=False)
        batch_op.create_index(batch_op.f('ix_order_total_quantity'), ['total_quantity'], unique=False)
        batch_op.create_index(batch_op.f('ix_order_updated_at'), ['updated_at'], unique=False)

    op.create_table('product',
    sa.Column('product_id', sa.String(length=64), nullable=False),
    sa.Column('seller_id', sa.String(length=64), nullable=True),
    sa.Column('product_name', sa.String(length=64), nullable=True),
    sa.Column('product_description', sa.String(length=120), nullable=True),
    sa.Column('product_price', sa.Float(), nullable=True),
    sa.Column('product_quantity', sa.Integer(), nullable=True),
    sa.Column('product_status', sa.Enum('Available', 'Unavailable'), nullable=True),
    sa.Column('product_category', sa.String(length=64), nullable=True),
    sa.Column('product_image', sa.String(length=40), nullable=False),
    sa.Column('product_image_url', sa.String(length=128), nullable=False),
    sa.Column('product_rating', sa.Float(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.Column('deleted_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['seller_id'], ['seller.seller_id'], ),
    sa.PrimaryKeyConstraint('product_id')
    )
    with op.batch_alter_table('product', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_product_created_at'), ['created_at'], unique=False)
        batch_op.create_index(batch_op.f('ix_product_deleted_at'), ['deleted_at'], unique=False)
        batch_op.create_index(batch_op.f('ix_product_product_category'), ['product_category'], unique=False)
        batch_op.create_index(batch_op.f('ix_product_product_description'), ['product_description'], unique=False)
        batch_op.create_index(batch_op.f('ix_product_product_name'), ['product_name'], unique=False)
        batch_op.create_index(batch_op.f('ix_product_product_price'), ['product_price'], unique=False)
        batch_op.create_index(batch_op.f('ix_product_product_quantity'), ['product_quantity'], unique=False)
        batch_op.create_index(batch_op.f('ix_product_product_rating'), ['product_rating'], unique=False)
        batch_op.create_index(batch_op.f('ix_product_product_status'), ['product_status'], unique=False)
        batch_op.create_index(batch_op.f('ix_product_updated_at'), ['updated_at'], unique=False)

    op.create_table('cart',
    sa.Column('cart_id', sa.String(length=64), nullable=False),
    sa.Column('customer_id', sa.String(length=64), nullable=True),
    sa.Column('product_id', sa.String(length=64), nullable=True),
    sa.Column('item_quantity', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['customer_id'], ['customer.customer_id'], ),
    sa.ForeignKeyConstraint(['product_id'], ['product.product_id'], ),
    sa.PrimaryKeyConstraint('cart_id')
    )
    with op.batch_alter_table('cart', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_cart_created_at'), ['created_at'], unique=False)
        batch_op.create_index(batch_op.f('ix_cart_item_quantity'), ['item_quantity'], unique=False)
        batch_op.create_index(batch_op.f('ix_cart_updated_at'), ['updated_at'], unique=False)

    op.create_table('purchase_history',
    sa.Column('purchase_id', sa.String(length=64), nullable=False),
    sa.Column('customer_id', sa.String(length=64), nullable=True),
    sa.Column('product_id', sa.String(length=64), nullable=True),
    sa.Column('order_id', sa.String(length=64), nullable=True),
    sa.Column('purchase_date', sa.DateTime(), nullable=True),
    sa.Column('purchase_quantity', sa.Integer(), nullable=True),
    sa.Column('purchase_price', sa.Float(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.Column('deleted_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['customer_id'], ['customer.customer_id'], ),
    sa.ForeignKeyConstraint(['order_id'], ['order.order_id'], ),
    sa.ForeignKeyConstraint(['product_id'], ['product.product_id'], ),
    sa.PrimaryKeyConstraint('purchase_id')
    )
    with op.batch_alter_table('purchase_history', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_purchase_history_created_at'), ['created_at'], unique=False)
        batch_op.create_index(batch_op.f('ix_purchase_history_deleted_at'), ['deleted_at'], unique=False)
        batch_op.create_index(batch_op.f('ix_purchase_history_purchase_date'), ['purchase_date'], unique=False)
        batch_op.create_index(batch_op.f('ix_purchase_history_purchase_price'), ['purchase_price'], unique=False)
        batch_op.create_index(batch_op.f('ix_purchase_history_purchase_quantity'), ['purchase_quantity'], unique=False)
        batch_op.create_index(batch_op.f('ix_purchase_history_updated_at'), ['updated_at'], unique=False)

    op.create_table('review',
    sa.Column('review_id', sa.String(length=64), nullable=False),
    sa.Column('customer_id', sa.String(length=64), nullable=True),
    sa.Column('product_id', sa.String(length=64), nullable=True),
    sa.Column('review_text', sa.String(length=280), nullable=True),
    sa.Column('review_date', sa.DateTime(), nullable=True),
    sa.Column('review_rating', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.Column('deleted_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['customer_id'], ['customer.customer_id'], ),
    sa.ForeignKeyConstraint(['product_id'], ['product.product_id'], ),
    sa.PrimaryKeyConstraint('review_id')
    )
    with op.batch_alter_table('review', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_review_created_at'), ['created_at'], unique=False)
        batch_op.create_index(batch_op.f('ix_review_deleted_at'), ['deleted_at'], unique=False)
        batch_op.create_index(batch_op.f('ix_review_review_date'), ['review_date'], unique=False)
        batch_op.create_index(batch_op.f('ix_review_review_rating'), ['review_rating'], unique=False)
        batch_op.create_index(batch_op.f('ix_review_review_text'), ['review_text'], unique=False)
        batch_op.create_index(batch_op.f('ix_review_updated_at'), ['updated_at'], unique=False)

    op.create_table('wishlist',
    sa.Column('wishlist_id', sa.String(length=64), nullable=False),
    sa.Column('customer_id', sa.String(length=64), nullable=True),
    sa.Column('product_id', sa.String(length=64), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['customer_id'], ['customer.customer_id'], ),
    sa.ForeignKeyConstraint(['product_id'], ['product.product_id'], ),
    sa.PrimaryKeyConstraint('wishlist_id')
    )
    with op.batch_alter_table('wishlist', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_wishlist_created_at'), ['created_at'], unique=False)
        batch_op.create_index(batch_op.f('ix_wishlist_updated_at'), ['updated_at'], unique=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('wishlist', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_wishlist_updated_at'))
        batch_op.drop_index(batch_op.f('ix_wishlist_created_at'))

    op.drop_table('wishlist')
    with op.batch_alter_table('review', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_review_updated_at'))
        batch_op.drop_index(batch_op.f('ix_review_review_text'))
        batch_op.drop_index(batch_op.f('ix_review_review_rating'))
        batch_op.drop_index(batch_op.f('ix_review_review_date'))
        batch_op.drop_index(batch_op.f('ix_review_deleted_at'))
        batch_op.drop_index(batch_op.f('ix_review_created_at'))

    op.drop_table('review')
    with op.batch_alter_table('purchase_history', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_purchase_history_updated_at'))
        batch_op.drop_index(batch_op.f('ix_purchase_history_purchase_quantity'))
        batch_op.drop_index(batch_op.f('ix_purchase_history_purchase_price'))
        batch_op.drop_index(batch_op.f('ix_purchase_history_purchase_date'))
        batch_op.drop_index(batch_op.f('ix_purchase_history_deleted_at'))
        batch_op.drop_index(batch_op.f('ix_purchase_history_created_at'))

    op.drop_table('purchase_history')
    with op.batch_alter_table('cart', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_cart_updated_at'))
        batch_op.drop_index(batch_op.f('ix_cart_item_quantity'))
        batch_op.drop_index(batch_op.f('ix_cart_created_at'))

    op.drop_table('cart')
    with op.batch_alter_table('product', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_product_updated_at'))
        batch_op.drop_index(batch_op.f('ix_product_product_status'))
        batch_op.drop_index(batch_op.f('ix_product_product_rating'))
        batch_op.drop_index(batch_op.f('ix_product_product_quantity'))
        batch_op.drop_index(batch_op.f('ix_product_product_price'))
        batch_op.drop_index(batch_op.f('ix_product_product_name'))
        batch_op.drop_index(batch_op.f('ix_product_product_description'))
        batch_op.drop_index(batch_op.f('ix_product_product_category'))
        batch_op.drop_index(batch_op.f('ix_product_deleted_at'))
        batch_op.drop_index(batch_op.f('ix_product_created_at'))

    op.drop_table('product')
    with op.batch_alter_table('order', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_order_updated_at'))
        batch_op.drop_index(batch_op.f('ix_order_total_quantity'))
        batch_op.drop_index(batch_op.f('ix_order_total_price'))
        batch_op.drop_index(batch_op.f('ix_order_order_status'))
        batch_op.drop_index(batch_op.f('ix_order_order_date'))
        batch_op.drop_index(batch_op.f('ix_order_deleted_at'))
        batch_op.drop_index(batch_op.f('ix_order_created_at'))

    op.drop_table('order')
    with op.batch_alter_table('seller', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_seller_updated_at'))
        batch_op.drop_index(batch_op.f('ix_seller_store_name'))
        batch_op.drop_index(batch_op.f('ix_seller_store_description'))
        batch_op.drop_index(batch_op.f('ix_seller_seller_status'))
        batch_op.drop_index(batch_op.f('ix_seller_phone_number'))
        batch_op.drop_index(batch_op.f('ix_seller_license_number'))
        batch_op.drop_index(batch_op.f('ix_seller_is_verified'))
        batch_op.drop_index(batch_op.f('ix_seller_deleted_at'))
        batch_op.drop_index(batch_op.f('ix_seller_created_at'))
        batch_op.drop_index(batch_op.f('ix_seller_bank_account'))
        batch_op.drop_index(batch_op.f('ix_seller_address'))

    op.drop_table('seller')
    with op.batch_alter_table('customer', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_customer_updated_at'))
        batch_op.drop_index(batch_op.f('ix_customer_total_spent'))
        batch_op.drop_index(batch_op.f('ix_customer_total_purchases'))
        batch_op.drop_index(batch_op.f('ix_customer_shipping_address'))
        batch_op.drop_index(batch_op.f('ix_customer_phone_number'))
        batch_op.drop_index(batch_op.f('ix_customer_payment_method'))
        batch_op.drop_index(batch_op.f('ix_customer_jewelery_preference'))
        batch_op.drop_index(batch_op.f('ix_customer_gender'))
        batch_op.drop_index(batch_op.f('ix_customer_deleted_at'))
        batch_op.drop_index(batch_op.f('ix_customer_created_at'))
        batch_op.drop_index(batch_op.f('ix_customer_brith_date'))
        batch_op.drop_index(batch_op.f('ix_customer_bank_details'))

    op.drop_table('customer')
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_user_username'))
        batch_op.drop_index(batch_op.f('ix_user_user_role'))
        batch_op.drop_index(batch_op.f('ix_user_updated_at'))
        batch_op.drop_index(batch_op.f('ix_user_phone_number'))
        batch_op.drop_index(batch_op.f('ix_user_name'))
        batch_op.drop_index(batch_op.f('ix_user_lastname'))
        batch_op.drop_index(batch_op.f('ix_user_last_login'))
        batch_op.drop_index(batch_op.f('ix_user_email'))
        batch_op.drop_index(batch_op.f('ix_user_deleted_at'))
        batch_op.drop_index(batch_op.f('ix_user_created_at'))

    op.drop_table('user')
    # ### end Alembic commands ###
