"""removr image_url

Revision ID: 61f71334d406
Revises: 1a9c60e6ee4d
Create Date: 2024-11-28 07:47:25.222333

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '61f71334d406'
down_revision = '1a9c60e6ee4d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('product', schema=None) as batch_op:
        batch_op.drop_column('product_image_url')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('product', schema=None) as batch_op:
        batch_op.add_column(sa.Column('product_image_url', mysql.VARCHAR(length=128), nullable=False))

    # ### end Alembic commands ###
