# coding=utf-8

from flask import Flask, jsonify, request
from .entities.entity import Session, engine, Base
from .entities.exam import Exam, ExamSchema

# creating the Flask application
app = Flask(__name__)

# if needed, generate database schema
Base.metadata.create_all(engine)


@app.route('/')
def index():
	return "Flask is running!!!"


@app.route('/exams')
def get_exams():
    # fetching from the database
    session = Session()
    exam_objects = session.query(Exam).all()

    # transforming into JSON-serializable objects
    schema = ExamSchema(many=True)
    exams = schema.dump(exam_objects)

    # serializing as JSON
    session.close()
    return jsonify(results = exams)


@app.route('/exams', methods=['POST'])
def add_exam():
    # mount exam object
    posted_exam = ExamSchema(only=('title', 'description'))\
        .load(request.get_json())

    exam = Exam(**posted_exam, created_by="HTTP post request")

    # persist exam
    session = Session()
    session.add(exam)
    session.commit()

    # return created exam
    new_exam = ExamSchema().dump(exam)
    session.close()
    return jsonify(new_exam), 201
'''
# start session
session = Session()

# check for existing data
exams = session.query(Exam).all()

if len(exams) == 0:
    # create and persist dummy exam
    python_exam = Exam("SQLAlchemy Exam", "Test your knowledge about SQLAlchemy.", "script")
    session.add(python_exam)
    session.commit()
    session.close()

    # reload exams
    exams = session.query(Exam).all()

# show existing exams
print('### Exams:')
for exam in exams:
    print(f'({exam.id}) {exam.title} - {exam.description}')


'''

if __name__ == "__main__":
	app.run(debug = True, port=9090)