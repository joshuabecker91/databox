from django.shortcuts import render, redirect


# from requests import Request, post
# from rest_framework import status


# Create your views here.

def index(request):
    # context = {
    #     'user' : 'John',
    # }
    return render(request, 'index2.html')

# def example(request):
#     return render(request, 'example.html')



# def route_one(response):
#     # context = {
#     #     'user' : 'John',
#     # }
#     return Response(response, status=status.HTTP_200_OK)


# def route_two(response):
#     # context = {
#     #     'user' : 'John',
#     # }
#     return Response(response, status=status.HTTP_200_OK)





# # Login and Registration --------------------------------------------------------------------

# # Login and Registration form page
# def login_reg(request):
#     if 'user_id' in request.session: # already logged in? re-route
#         return redirect('/')
#     return render(request, 'login_reg.html')

# # Register a New User
# def register(request):
#     if request.method=='POST':
#         errors = User.objects.reg_validate(request.POST)
#         if errors:
#             for error in errors:
#                 messages.error(request, errors[error])
#             return redirect('/login_reg')
#         user_pw = request.POST['password']
#         hash_pw = bcrypt.hashpw(user_pw.encode(), bcrypt.gensalt()).decode()
#         new_user = User.objects.create(first_name=request.POST['first_name'],last_name=request.POST['last_name'],email=request.POST['email'],password=hash_pw)
#         request.session['user_id'] = new_user.id
#         request.session['user_name'] = f"{new_user.first_name} {new_user.last_name}"
#         return redirect('/dashboard')
#     return redirect('/')

# # Login
# def login(request):
#     if request.method=='POST':
#         logged_user=User.objects.filter(email=request.POST['email'])
#         if logged_user:
#             logged_user=logged_user[0]
#             if bcrypt.checkpw(request.POST['password'].encode(), logged_user.password.encode()):
#                 request.session['user_id'] = logged_user.id
#                 request.session['user_name'] = f"{logged_user.first_name} {logged_user.last_name}"
#                 return redirect('/dashboard')
#             else:
#                 messages.error(request,"Password is incorrect.")
#                 return redirect('/login_reg')
#         else:
#             messages.error(request,"Email was not found.")
#             return redirect('/login_reg') # added this line, if email not found was sending them back to home
#     return redirect('/')

# # Logout - Clear Session
# def logout(request):
#     request.session.clear()
#     return redirect('/')

# # Dashboard - Check if Logged in, get like count and all videos
# def dashboard(request):
#     if 'user_id' not in request.session:
#         return redirect('/login_reg')
#     user = User.objects.get(id=request.session['user_id'])
#     context = {
#         'user' : user,
#         'all_videos': Video.objects.all(),
#         'all_likes': Liked.objects.all(),
#     }
#     return render(request,'dashboard.html', context)