# coding=utf-8

from flask import Flask, jsonify, request
from .entities.entity import Session, engine, Base
from .entities.exam import Exam, ExamSchema
from flask_cors import CORS

# creating the Flask application
app = Flask(__name__)

CORS(app)

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=9010)

# if needed, generate database schema
Base.metadata.create_all(engine)


@app.route('/')
def index():
	return "Flask is running!!!"


@app.route('/exams')
def get_exams():
    session = Session()
    exam_objects = session.query(Exam).all()
    schema = ExamSchema(many=True)
    exams = schema.dump(exam_objects)
    session.close()
    response = jsonify(results = exams)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/exams/addexam', methods=['POST'])
def add_exam():
    posted_exam = ExamSchema(only=('title', 'description'))\
        .load(request.get_json())

    exam = Exam(**posted_exam, created_by="HTTP post request")
    session = Session()
    session.add(exam)
    session.commit()
    new_exam = ExamSchema().dump(exam)
    session.close()
    return jsonify(new_exam), 201


@app.route('/exams/deleteexam', methods=['POST'])
def delete_exam():
    title = request.args.get('title')
    session = Session()
    delete_object = session.query(Exam).filter_by(title = title).first()

    if delete_object is not None:
    	session.delete(delete_object)
    	session.commit()
    exam_objects = session.query(Exam).all()
    schema = ExamSchema(many=True)
    exams = schema.dump(exam_objects)
    session.close()
    response = jsonify(results = exams)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response,201

@app.route('/exams/updateexam', methods=['POST'])
def update_exam():
    posted_exam = ExamSchema(only=('title', 'description'))\
        .load(request.get_json())
    exam = Exam(**posted_exam, created_by="HTTP post request")
    title = request.args.get('title')
    session = Session()
    update_object = session.query(Exam).filter_by(title = title).first()

    if update_object is not None:
    	update_object.title = exam.title
    	update_object.description = exam.description
    	session.add(update_object)
    	session.commit()
    exam_objects = session.query(Exam).all()
    schema = ExamSchema(many=True)
    exams = schema.dump(exam_objects)
    session.close()
    response = jsonify(results = exams)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response,201