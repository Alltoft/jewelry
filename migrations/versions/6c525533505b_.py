"""empty message

Revision ID: 6c525533505b
Revises: 05fccde16c10
Create Date: 2024-12-20 09:16:16.530091

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6c525533505b'
down_revision = '05fccde16c10'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('product', schema=None) as batch_op:
        batch_op.add_column(sa.Column('produc_gemstone', sa.String(length=64), nullable=True))
        batch_op.create_index(batch_op.f('ix_product_produc_gemstone'), ['produc_gemstone'], unique=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('product', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_product_produc_gemstone'))
        batch_op.drop_column('produc_gemstone')

    # ### end Alembic commands ###
