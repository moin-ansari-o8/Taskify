# Generated by Django 5.1.4 on 2025-03-05 04:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0011_remove_task_shownotification_notification'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='plain_password',
            field=models.CharField(blank=True, max_length=128, null=True),
        ),
    ]
