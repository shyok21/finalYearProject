import threading
import os
import time
def student_server():
	print('\nStarting Students Server')
	os.system('sh students.sh')
	
def admin_server():
	print('\nStarting Admin Server')
	os.system('sh admin.sh')
	
t1 = threading.Thread(target=student_server)
t2 = threading.Thread(target=admin_server)

time.sleep(1)

t1.start()
time.sleep(5)

t2.start()
time.sleep(5)

t1.join()

t2.join()
