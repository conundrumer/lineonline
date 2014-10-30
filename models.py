from django.db import models
from django.utils import timezone
from datetime import datetime

from django.contrib.auth.models import User

class UserProfile(models.Model):
	user = models.OneToOneField(User)
	location = models.CharField(max_length=200, default='', blank=True)
	about = models.TextField(max_length=20000, default='', blank=True)
	picture = models.ImageField(upload_to='profile-pictures', default='', blank=True)
	follows = models.ManyToManyField('self', related_name='followed_by', symmetrical=False)
	blocks = models.ManyToManyField('self', related_name='blocked_by', symmetrical=False)

class Track(models.Model):
	owner = models.ForeignKey(User, related_name='owned_tracks')
	collaborators = models.ManyToManyField(User, related_name='collaborated_tracks')
	title = models.CharField(max_length=200)
	description = models.TextField(max_length=20000, default='', blank=True)
	scene = blob
	conversation = models.OneToOneField(ProjectConversation)
	views = models.IntegerField(default=0)
	favorited_by = models.ManyToManyField(User, related_name='favorites')
	date_created = models.DateTimeField()
	invitees = models.ManyToManyField(User, related_name='invited_tracks')
	# date_modified
	# unique_url
	# public / private / unlisted status code thing

class Conversation(models.Model):
	participants: models.ManyToManyField(User, related_name='conversations')

class Message(models.Model):
	author = models.ForeignKey(User, related_name='messages')
	text = models.TextField(max_length=20000)
	date_created = models.DateTimeField()
	conversation = models.ForeignKey(Conversation, related_name='messages')

class Invite(models.Model):
	sender = models.ForeignKey(User, related_name='sent_invites')
	recipients = models.ManyToManyField(User, related_name='received_invites')
	track = models.ForeignKey(Track, related_name='invites')

class Collection(models.Model):
	user = models.ForeignKey(User, related_name='collections')
	tracks = models.ManyToManyField(Track, related_name='collections')
	name = models.CharField(max_length=200)
	description = models.TextField(max_length=20000)

