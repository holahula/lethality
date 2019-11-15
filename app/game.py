class State:
    def __init__(self, username):
        self.username = username    
    
    def printUsername(self):
        print("Name: " + self.username)

s1 = State("austin")

s1.printUsername()

