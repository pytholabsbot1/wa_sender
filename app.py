from flask import Flask, render_template, send_file, request
from bot import WaSender
import threading

app = Flask(__name__)

instances = {}


@app.route('/startmsg', methods=['POST'])
def start_msg():

    pos = request.form['pos']
    params = {
        "nums": request.form['nums'].split('\n'),
        "msg": request.form['msg'],
        "file": request.form['file'],
    }

    ins_ = instances[int(pos)]
    [setattr(ins_, key, val) for key, val in params.items()]

    t_ = Thread(target=ins_.start_messaging)
    t_.start()

    return "setted shit up"


@app.route('/img/<pos>')
def img(pos):
    img_data = instances[int(pos)].screenshot()

    return f"""<img width="500px" src="data:image/png;base64,{img_data}"  />"""


@app.route('/quit/<pos>')
def close(pos):
    instances[int(pos)].driver.quit()
    del instances[int(pos)]
    return f"Closed {pos} instance"


@app.route('/new')
def new():
    i_ = WaSender()
    instances[i_.id] = i_
    return "started new Instance"


@app.route('/logs/<pos>')
def logs(pos):
    ins_ = instances[int(pos)]

    return f"<div> {'<br>'.join(ins_.logs)} </div>"


@app.route('/')
def hello():
    return render_template('index.html', instances=instances)


if __name__ == "__main__":

    import logging

    logging.basicConfig(filename="error.log", level=logging.DEBUG)
    
    threading.Thread(target=lambda: app.run(host='0.0.0.0', port=8000 ,debug=True, use_reloader=False)).start()
    
    while True:
        try:
            eval(input("command: "))
        except Exception as e:
            print(e)
