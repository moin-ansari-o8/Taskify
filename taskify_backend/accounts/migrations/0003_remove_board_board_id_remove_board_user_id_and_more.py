# Generated by Django 5.1.4 on 2025-02-23 17:17

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_remove_user_id_user_user_id_alter_user_email_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='board',
            name='board_id',
        ),
        migrations.RemoveField(
            model_name='board',
            name='user_id',
        ),
        migrations.RemoveField(
            model_name='card',
            name='board_id',
        ),
        migrations.RemoveField(
            model_name='card',
            name='card_id',
        ),
        migrations.RemoveField(
            model_name='task',
            name='card_id',
        ),
        migrations.RemoveField(
            model_name='task',
            name='task_id',
        ),
        migrations.RemoveField(
            model_name='user',
            name='user_id',
        ),
        migrations.AddField(
            model_name='board',
            name='id',
            field=models.BigAutoField(auto_created=True, default=1, primary_key=True, serialize=False, verbose_name='ID'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='board',
            name='user',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='accounts.user'),
        ),
        migrations.AddField(
            model_name='card',
            name='board',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='accounts.board'),
        ),
        migrations.AddField(
            model_name='card',
            name='id',
            field=models.BigAutoField(auto_created=True, default=1, primary_key=True, serialize=False, verbose_name='ID'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='task',
            name='card',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='accounts.card'),
        ),
        migrations.AddField(
            model_name='task',
            name='id',
            field=models.BigAutoField(auto_created=True, default=1, primary_key=True, serialize=False, verbose_name='ID'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='user',
            name='id',
            field=models.BigAutoField(auto_created=True, default=1, primary_key=True, serialize=False, verbose_name='ID'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='board',
            name='board_title',
            field=models.CharField(default='Untitled Board', max_length=100),
        ),
        migrations.AlterField(
            model_name='card',
            name='card_title',
            field=models.CharField(default='New Card', max_length=50),
        ),
        migrations.AlterField(
            model_name='task',
            name='desc',
            field=models.TextField(blank=True, default=''),
        ),
        migrations.AlterField(
            model_name='task',
            name='task_title',
            field=models.CharField(default='New Task', max_length=200),
        ),
        migrations.AlterField(
            model_name='user',
            name='password',
            field=models.CharField(max_length=128),
        ),
    ]
