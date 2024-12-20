"""Add ProductImage model

Revision ID: 1a9c60e6ee4d
Revises: 2844da286eae
Create Date: 2024-11-28 07:46:13.011573

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '1a9c60e6ee4d'
down_revision = '2844da286eae'
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
        batch_op.drop_index('ix_product_product_rating')
        batch_op.drop_column('product_rating')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('product', schema=None) as batch_op:
        batch_op.add_column(sa.Column('product_rating', mysql.FLOAT(), nullable=True))
        batch_op.create_index('ix_product_product_rating', ['product_rating'], unique=False)

    op.drop_table('product_image')
    # ### end Alembic commands ###
