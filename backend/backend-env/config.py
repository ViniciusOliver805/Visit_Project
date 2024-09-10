import os

DATABASE = {
    'host': os.getenv ('localhost'),
    'user': os.getenv ('root'),
    'password': os.getenv ('root'),
    'database': os.getenv ('bdvisita')
}
