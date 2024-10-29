"""empty message

Revision ID: 2bbb870d58f3
Revises: 852e9ec659bd
Create Date: 2024-10-26 11:56:33.869909

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '2bbb870d58f3'
down_revision = '852e9ec659bd'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('wishlist', schema=None) as batch_op:
        batch_op.drop_index('ix_wishlist_deleted_at')
        batch_op.drop_column('deleted_at')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('wishlist', schema=None) as batch_op:
        batch_op.add_column(sa.Column('deleted_at', mysql.DATETIME(), nullable=True))
        batch_op.create_index('ix_wishlist_deleted_at', ['deleted_at'], unique=False)

    # ### end Alembic commands ###