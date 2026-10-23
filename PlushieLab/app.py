from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/new-collection')
def new_collection():
    return render_template('new_collection.html')

@app.route('/design')
def design():
    return render_template('design.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/tracking')
def tracking():
    return render_template('tracking.html')

if __name__ == '__main__':
    app.run(debug=True)
