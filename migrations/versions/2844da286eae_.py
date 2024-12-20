"""empty message

Revision ID: 2844da286eae
Revises: 25acc88433f0
Create Date: 2024-11-22 08:54:37.061615

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '2844da286eae'
down_revision = '25acc88433f0'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('product', schema=None) as batch_op:
        batch_op.alter_column('product_category',
               existing_type=mysql.VARCHAR(length=64),
               type_=sa.Enum('Rings', 'Necklaces', 'Bracelets', 'Earrings', 'Watches', 'Brooches', 'Anklets', 'Cufflinks', 'Pendants', 'Charms'),
               existing_nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('product', schema=None) as batch_op:
        batch_op.alter_column('product_category',
               existing_type=sa.Enum('Rings', 'Necklaces', 'Bracelets', 'Earrings', 'Watches', 'Brooches', 'Anklets', 'Cufflinks', 'Pendants', 'Charms'),
               type_=mysql.VARCHAR(length=64),
               existing_nullable=True)

    # ### end Alembic commands ###
