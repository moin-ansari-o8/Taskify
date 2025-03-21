# Generated by Django 5.1.4 on 2025-02-23 17:09

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='id',
        ),
        migrations.AddField(
            model_name='user',
            name='user_id',
            field=models.AutoField(default=1, primary_key=True, serialize=False),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.EmailField(max_length=100, unique=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='role',
            field=models.CharField(default='user', max_length=10),
        ),
        migrations.AlterField(
            model_name='user',
            name='username',
            field=models.CharField(max_length=50, unique=True),
        ),
        migrations.CreateModel(
            name='Board',
            fields=[
                ('board_id', models.AutoField(primary_key=True, serialize=False)),
                ('board_title', models.CharField(max_length=100)),
                ('user_id', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='accounts.user')),
            ],
        ),
        migrations.CreateModel(
            name='Card',
            fields=[
                ('card_id', models.AutoField(primary_key=True, serialize=False)),
                ('card_title', models.CharField(max_length=50)),
                ('category', models.CharField(choices=[('todo', 'ToDo'), ('schedule', 'Schedule'), ('project', 'Project')], default='todo', max_length=10)),
                ('created_date_time', models.DateTimeField(auto_now_add=True)),
                ('updated_date_time', models.DateTimeField(auto_now=True)),
                ('board_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts.board')),
            ],
        ),
        migrations.CreateModel(
            name='Task',
            fields=[
                ('task_id', models.AutoField(primary_key=True, serialize=False)),
                ('task_title', models.CharField(max_length=200)),
                ('desc', models.TextField(blank=True)),
                ('due_date', models.DateTimeField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('priority', models.CharField(choices=[('high', 'High'), ('medium', 'Medium'), ('low', 'Low')], default='medium', max_length=6)),
                ('card_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts.card')),
            ],
        ),
    ]
