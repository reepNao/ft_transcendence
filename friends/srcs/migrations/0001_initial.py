# Generated by Django 4.2.10 on 2024-02-23 20:40

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Friends',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('deleted_at', models.DateTimeField(blank=True, null=True)),
                ('sender_id', models.PositiveIntegerField(default=0, help_text='Sender ID')),
                ('receiver_id', models.PositiveIntegerField(default=0, help_text='Receiver ID')),
                ('state', models.PositiveIntegerField(default=0, help_text='0: Pending, 1: Accepted, 2: Rejected, 3: Blocked')),
            ],
        ),
    ]
