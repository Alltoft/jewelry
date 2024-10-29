"""empty message

Revision ID: 12e894bf7a74
Revises: 3af6705ba9a9
Create Date: 2024-10-29 07:01:27.834848

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '12e894bf7a74'
down_revision = '3af6705ba9a9'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('cart', schema=None) as batch_op:
        batch_op.add_column(sa.Column('item_quantity', sa.Integer(), nullable=True))
        batch_op.drop_index('ix_cart_cart_quantity')
        batch_op.create_index(batch_op.f('ix_cart_item_quantity'), ['item_quantity'], unique=False)
        batch_op.drop_column('cart_quantity')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('cart', schema=None) as batch_op:
        batch_op.add_column(sa.Column('cart_quantity', mysql.INTEGER(), autoincrement=False, nullable=True))
        batch_op.drop_index(batch_op.f('ix_cart_item_quantity'))
        batch_op.create_index('ix_cart_cart_quantity', ['cart_quantity'], unique=False)
        batch_op.drop_column('item_quantity')

    # ### end Alembic commands ###