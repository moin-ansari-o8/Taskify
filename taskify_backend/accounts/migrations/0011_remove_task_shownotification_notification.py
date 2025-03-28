# Generated by Django 5.1.4 on 2025-03-03 03:07

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0010_task_shownotification'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='task',
            name='showNotification',
        ),
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('due_date', models.DateTimeField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('dismissed', models.BooleanField(default=False)),
                ('task', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notifications', to='accounts.task')),
            ],
        ),
    ]
