# Generated by Django 5.0.7 on 2024-07-21 06:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('src', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='usermanagement',
            name='phone',
        ),
    ]
