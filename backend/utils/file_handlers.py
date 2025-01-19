# backend/utils/file_handlers.py
import os
import uuid
from werkzeug.utils import secure_filename
from PIL import Image
from io import BytesIO
import magic
import shutil
from datetime import datetime

class FileHandler:
    UPLOAD_FOLDER = 'static/uploads'
    ALLOWED_EXTENSIONS = {
        'image': {'png', 'jpg', 'jpeg', 'gif', 'svg'},
        'document': {'pdf', 'doc', 'docx', 'xls', 'xlsx'},
        'all': {'png', 'jpg', 'jpeg', 'gif', 'svg', 'pdf', 'doc', 'docx', 'xls', 'xlsx'}
    }
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

    def __init__(self):
        self._ensure_upload_directory()

    def _ensure_upload_directory(self):
        """Asegura que el directorio de uploads exista"""
        if not os.path.exists(self.UPLOAD_FOLDER):
            os.makedirs(self.UPLOAD_FOLDER)

    def allowed_file(self, filename, file_type='all'):
        """Verifica si la extensión del archivo está permitida"""
        if '.' not in filename:
            return False
        ext = filename.rsplit('.', 1)[1].lower()
        return ext in self.ALLOWED_EXTENSIONS.get(file_type, set())

    def get_safe_filename(self, filename):
        """Genera un nombre de archivo seguro y único"""
        base = secure_filename(filename)
        name, ext = os.path.splitext(base)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        unique_id = str(uuid.uuid4())[:8]
        return f"{name}_{timestamp}_{unique_id}{ext}"

    def save_file(self, file, file_type='all', optimize=True):
        """Guarda un archivo en el sistema"""
        try:
            if not file:
                raise ValueError("No se proporcionó archivo")

            if not self.allowed_file(file.filename, file_type):
                raise ValueError("Tipo de archivo no permitido")

            # Verificar tamaño del archivo
            file.seek(0, os.SEEK_END)
            size = file.tell()
            file.seek(0)

            if size > self.MAX_FILE_SIZE:
                raise ValueError("Archivo demasiado grande")

            # Generar nombre seguro
            filename = self.get_safe_filename(file.filename)
            file_path = os.path.join(self.UPLOAD_FOLDER, filename)

            # Si es imagen y se requiere optimización
            if optimize and file_type == 'image' and not filename.endswith('.svg'):
                self._save_optimized_image(file, file_path)
            else:
                file.save(file_path)

            return filename

        except Exception as e:
            print(f"Error guardando archivo: {e}")
            raise

    def _save_optimized_image(self, file, file_path, max_size=(1200, 1200)):
        """Guarda una imagen optimizada"""
        try:
            image = Image.open(file)
            
            # Convertir a RGB si es necesario
            if image.mode in ('RGBA', 'P'):
                image = image.convert('RGB')
            
            # Redimensionar si es muy grande
            if image.size[0] > max_size[0] or image.size[1] > max_size[1]:
                image.thumbnail(max_size, Image.Resampling.LANCZOS)
            
            # Guardar con optimización
            image.save(file_path, optimize=True, quality=85)
        
        except Exception as e:
            print(f"Error optimizando imagen: {e}")
            raise

    def delete_file(self, filename):
        """Elimina un archivo del sistema"""
        try:
            file_path = os.path.join(self.UPLOAD_FOLDER, filename)
            if os.path.exists(file_path):
                os.remove(file_path)
                return True
            return False
        except Exception as e:
            print(f"Error eliminando archivo: {e}")
            return False

    def move_file(self, source, destination):
        """Mueve un archivo a otra ubicación"""
        try:
            src_path = os.path.join(self.UPLOAD_FOLDER, source)
            dst_path = os.path.join(self.UPLOAD_FOLDER, destination)
            
            if not os.path.exists(src_path):
                raise FileNotFoundError("Archivo origen no encontrado")
            
            shutil.move(src_path, dst_path)
            return True
        
        except Exception as e:
            print(f"Error moviendo archivo: {e}")
            return False

    def get_file_info(self, filename):
        """Obtiene información sobre un archivo"""
        try:
            file_path = os.path.join(self.UPLOAD_FOLDER, filename)
            if not os.path.exists(file_path):
                return None

            stats = os.stat(file_path)
            mime = magic.Magic(mime=True)
            
            return {
                'name': filename,
                'size': stats.st_size,
                'created': datetime.fromtimestamp(stats.st_ctime),
                'modified': datetime.fromtimestamp(stats.st_mtime),
                'mime_type': mime.from_file(file_path)
            }

        except Exception as e:
            print(f"Error obteniendo información del archivo: {e}")
            return None

    def create_thumbnail(self, filename, size=(200, 200)):
        """Crea un thumbnail de una imagen"""
        try:
            if not filename or not self.allowed_file(filename, 'image'):
                return None

            source_path = os.path.join(self.UPLOAD_FOLDER, filename)
            name, ext = os.path.splitext(filename)
            thumb_filename = f"{name}_thumb{ext}"
            thumb_path = os.path.join(self.UPLOAD_FOLDER, thumb_filename)

            # No crear thumbnail para SVG
            if ext.lower() == '.svg':
                return filename

            image = Image.open(source_path)
            image.thumbnail(size, Image.Resampling.LANCZOS)
            image.save(thumb_path, optimize=True, quality=85)

            return thumb_filename

        except Exception as e:
            print(f"Error creando thumbnail: {e}")
            return None

    def get_file_url(self, filename):
        """Genera URL para acceder al archivo"""
        if not filename:
            return None
        
        try:
            # Verificar que el archivo existe
            file_path = os.path.join(self.UPLOAD_FOLDER, filename)
            if not os.path.exists(file_path):
                return None

            # Generar URL relativa
            return f"/uploads/{filename}"

        except Exception as e:
            print(f"Error generando URL del archivo: {e}")
            return None