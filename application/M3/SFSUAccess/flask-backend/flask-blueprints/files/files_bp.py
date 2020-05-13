import os
from flask import Blueprint, request, jsonify, flash, redirect, url_for, send_from_directory, Response
from werkzeug.utils import secure_filename
from mutagen import File
from wand.image import Image

from db_credentials import cur, connection

files_bp = Blueprint('files_bp', import_name=__name__)

ALLOWED_EXTENSIONS = {'pdf', 'mp3', 'mp4', 'jpg', 'png'}


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def upload_file(request, product_id):
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        # if user does not select file, browser also
        # submit an empty part without filename
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            #get file extension
            filename = secure_filename(file.filename)
            file_extension = os.path.splitext(filename)
            #rename file
            filename= str(product_id) + file_extension[1]
            from sfsuaccess import app
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            generate_thumbnail(filename,product_id,file_extension[1])
            return Response(status=200)

def generate_thumbnail(filename,product_id, extension):
    from sfsuaccess import app
    if extension == ".mp3":
        file = File(os.path.join(app.config['UPLOAD_FOLDER'],filename))
        artwork = file.tags['APIC:'].data  # access APIC frame and grab the image
        with open(os.path.join(app.config['UPLOAD_FOLDER'],"thumbnails",str(product_id)+'.png'), 'wb') as img:
            img.write(artwork)  # write artwork to new image
    elif extension == ".pdf":
        img = Image(filename=app.config['UPLOAD_FOLDER'] +"/"+filename, resolution=300, width=600)
        img.save(filename=app.config['UPLOAD_FOLDER'] + "/thumbnails/"+str(product_id)+'.png')
    elif extension == ".jpg" or extension == ".png":
        img = Image(filename=app.config['UPLOAD_FOLDER'] +"/"+filename)
        img.thumbnail(img.size[0]/10, img.size[1]/10) # set thumbnail sizing to 1/10th resolution
        img.save(filename=app.config['UPLOAD_FOLDER'] + "/thumbnails/"+str(product_id)+'.png')
    elif extension == ".mp4":
        #TODO
        print ("issa video")

def get_filename(product_id):
    from sfsuaccess import app
    path = app.config['UPLOAD_FOLDER']
    for filename in os.listdir(path):
        if filename.startswith(product_id):
            return(filename)

#downloading the file
@files_bp.route('/uploads/<product_id>')
def uploaded_file(product_id):
    from sfsuaccess import app
    return send_from_directory(app.config['UPLOAD_FOLDER'],
                               get_filename(product_id))

#downloading the thumbnails
@files_bp.route('/thumbnails/<product_id>')
def uploaded_file_thumbnail(product_id):
    from sfsuaccess import app
    return send_from_directory(os.path.join(app.config['UPLOAD_FOLDER'],"thumbnails"),product_id+'.png')
