const util = require('util')
let socketio = require('socket.io')

module.exports.listen = function(server){
    let io = socketio.listen(server)

    // ------------------------------ Traitement du socket
    let objUtilisateur = {}
    let message = {}
    io.on('connection', function(socket){
    console.log(socket.id)
        socket.on('setUser', function(data){
            objUtilisateur[socket.id] = data.user
            console.log("objUtilisateur = "+ util.inspect(objUtilisateur))
            console.log(util.inspect(data))
            socket.emit('valide_user', data)
            socket.emit('diffuser_list_user', objUtilisateur)
        })
        socket.on('msg', function(data) {
            message[socket.id] = data.user
            let msg = 'msg';
            message[msg] = data.message
            console.log(message[msg])
            console.log("message = "+ util.inspect(message))
            console.log(util.inspect(data))
            socket.emit('nouveau_msg', message)
        })
   })
 return io
}