from flask import Flask, request, jsonify
import mysql.connector
from config import DATABASE
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

# Função para conectar ao banco de dados
def get_db_connection():
    return mysql.connector.connect(**DATABASE)

# Rota para obter todos os registros
@app.route('/visitas', methods=['GET'])
def get_visitas():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM visitas')
    visitas = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(visitas)

# Rota para obter um registro específico
@app.route('/visitas/<int:id>', methods=['GET'])
def get_visita(id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM visitas WHERE id = %s', (id,))
    visita = cursor.fetchone()
    cursor.close()
    conn.close()
    if visita is None:
        return jsonify({'error': 'Visita não encontrada'}), 404
    return jsonify(visita)

# Rota para adicionar um novo registro
@app.route('/visitas', methods=['POST'])
def create_visita():
    new_visita = request.get_json()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        'INSERT INTO visitas (nome, tipo_empresa, tipo_cliente, tipo_pneu, quantidade_pneu, preco_oferecido, hora_data, observacoes) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)',
        (new_visita['nome'], new_visita['tipo_empresa'], new_visita['tipo_cliente'], new_visita['tipo_pneu'], new_visita['quantidade_pneu'], new_visita['preco_oferecido'], new_visita['hora_data'], new_visita['observacoes'])
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify(new_visita), 201

# Rota para atualizar um registro específico
@app.route('/visitas/<int:id>', methods=['PUT'])
def update_visita(id):
    updated_visita = request.get_json()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        'UPDATE visitas SET nome = %s, tipo_empresa = %s, tipo_cliente = %s, tipo_pneu = %s, quantidade_pneu = %s, preco_oferecido = %s, hora_data = %s, observacoes = %s WHERE id = %s',
        (updated_visita['nome'], updated_visita['tipo_empresa'], updated_visita['tipo_cliente'], updated_visita['tipo_pneu'], updated_visita['quantidade_pneu'], updated_visita['preco_oferecido'], updated_visita['hora_data'], updated_visita['observacoes'], id)
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify(updated_visita)

# Rota para excluir um registro específico
@app.route('/visitas/<int:id>', methods=['DELETE'])
def delete_visita(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM visitas WHERE id = %s', (id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'Visita excluída'})

if __name__ == '__main__':
    app.run(debug=True)
