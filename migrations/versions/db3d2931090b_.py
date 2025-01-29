"""empty message

Revision ID: db3d2931090b
Revises: 
Create Date: 2024-12-26 12:34:32.807065

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'db3d2931090b'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('product_image',
    sa.Column('image_id', sa.String(length=64), nullable=False),
    sa.Column('product_id', sa.String(length=64), nullable=True),
    sa.Column('image', sa.String(length=128), nullable=True),
    sa.ForeignKeyConstraint(['product_id'], ['product.product_id'], ),
    sa.PrimaryKeyConstraint('image_id')
    )
    with op.batch_alter_table('product', schema=None) as batch_op:
        batch_op.add_column(sa.Column('original_price', sa.Float(), nullable=True))
        batch_op.add_column(sa.Column('product_style', sa.String(length=64), nullable=True))
        batch_op.add_column(sa.Column('product_weight', sa.Float(), nullable=True))
        batch_op.add_column(sa.Column('product_gemstone', sa.String(length=64), nullable=True))
        batch_op.add_column(sa.Column('product_refference', sa.String(length=64), nullable=True))
        batch_op.add_column(sa.Column('product_material', sa.Enum('Gold', 'Silver', 'Platinum', 'Diamond', 'Pearl', 'Emerald', 'Ruby', 'Sapphire'), nullable=True))
        batch_op.drop_index('ix_product_product_rating')
        batch_op.create_index(batch_op.f('ix_product_original_price'), ['original_price'], unique=False)
        batch_op.create_index(batch_op.f('ix_product_product_gemstone'), ['product_gemstone'], unique=False)
        batch_op.create_index(batch_op.f('ix_product_product_material'), ['product_material'], unique=False)
        batch_op.create_index(batch_op.f('ix_product_product_refference'), ['product_refference'], unique=False)
        batch_op.create_index(batch_op.f('ix_product_product_style'), ['product_style'], unique=False)
        batch_op.create_index(batch_op.f('ix_product_product_weight'), ['product_weight'], unique=False)
        batch_op.drop_column('product_rating')
        batch_op.drop_column('product_image_url')

    with op.batch_alter_table('wishlist', schema=None) as batch_op:
        batch_op.drop_column('product_image')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('wishlist', schema=None) as batch_op:
        batch_op.add_column(sa.Column('product_image', mysql.VARCHAR(length=40), nullable=True))

    with op.batch_alter_table('product', schema=None) as batch_op:
        batch_op.add_column(sa.Column('product_image_url', mysql.VARCHAR(length=128), nullable=False))
        batch_op.add_column(sa.Column('product_rating', mysql.FLOAT(), nullable=True))
        batch_op.drop_index(batch_op.f('ix_product_product_weight'))
        batch_op.drop_index(batch_op.f('ix_product_product_style'))
        batch_op.drop_index(batch_op.f('ix_product_product_refference'))
        batch_op.drop_index(batch_op.f('ix_product_product_material'))
        batch_op.drop_index(batch_op.f('ix_product_product_gemstone'))
        batch_op.drop_index(batch_op.f('ix_product_original_price'))
        batch_op.create_index('ix_product_product_rating', ['product_rating'], unique=False)
        batch_op.drop_column('product_material')
        batch_op.drop_column('product_refference')
        batch_op.drop_column('product_gemstone')
        batch_op.drop_column('product_weight')
        batch_op.drop_column('product_style')
        batch_op.drop_column('original_price')

    op.drop_table('product_image')
    # ### end Alembic commands ###
