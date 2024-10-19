"""I'm here

Revision ID: 7bc325fecede
Revises: 6a4f303f4065
Create Date: 2024-10-14 14:10:42.983070

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7bc325fecede'
down_revision = '6a4f303f4065'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('costumer',
    sa.Column('costumer_id', sa.Integer(), nullable=False),
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
    sa.PrimaryKeyConstraint('costumer_id'),
    sa.UniqueConstraint('user_id')
    )
    with op.batch_alter_table('costumer', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_costumer_bank_details'), ['bank_details'], unique=False)
        batch_op.create_index(batch_op.f('ix_costumer_brith_date'), ['brith_date'], unique=False)
        batch_op.create_index(batch_op.f('ix_costumer_created_at'), ['created_at'], unique=False)
        batch_op.create_index(batch_op.f('ix_costumer_deleted_at'), ['deleted_at'], unique=False)
        batch_op.create_index(batch_op.f('ix_costumer_gender'), ['gender'], unique=False)
        batch_op.create_index(batch_op.f('ix_costumer_jewelery_preference'), ['jewelery_preference'], unique=False)
        batch_op.create_index(batch_op.f('ix_costumer_payment_method'), ['payment_method'], unique=False)
        batch_op.create_index(batch_op.f('ix_costumer_phone_number'), ['phone_number'], unique=False)
        batch_op.create_index(batch_op.f('ix_costumer_shipping_address'), ['shipping_address'], unique=False)
        batch_op.create_index(batch_op.f('ix_costumer_total_purchases'), ['total_purchases'], unique=False)
        batch_op.create_index(batch_op.f('ix_costumer_total_spent'), ['total_spent'], unique=False)
        batch_op.create_index(batch_op.f('ix_costumer_updated_at'), ['updated_at'], unique=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('costumer', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_costumer_updated_at'))
        batch_op.drop_index(batch_op.f('ix_costumer_total_spent'))
        batch_op.drop_index(batch_op.f('ix_costumer_total_purchases'))
        batch_op.drop_index(batch_op.f('ix_costumer_shipping_address'))
        batch_op.drop_index(batch_op.f('ix_costumer_phone_number'))
        batch_op.drop_index(batch_op.f('ix_costumer_payment_method'))
        batch_op.drop_index(batch_op.f('ix_costumer_jewelery_preference'))
        batch_op.drop_index(batch_op.f('ix_costumer_gender'))
        batch_op.drop_index(batch_op.f('ix_costumer_deleted_at'))
        batch_op.drop_index(batch_op.f('ix_costumer_created_at'))
        batch_op.drop_index(batch_op.f('ix_costumer_brith_date'))
        batch_op.drop_index(batch_op.f('ix_costumer_bank_details'))

    op.drop_table('costumer')
    # ### end Alembic commands ###