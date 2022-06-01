import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      prestamos: [],
      pos: null,
      titulo: 'Nuevo',
      id: 0,
      id_libro: 0,
      id_usuario: 0,
      fec_prestamo: '',
      fec_devolucion: ''
    })

    this.cambioLibro = this.cambioLibro.bind(this);
    this.cambioUsuario = this.cambioUsuario.bind(this);
    this.cambioFechaPrestamo = this.cambioFechaPrestamo.bind(this);
    this.cambioFechaDevolucion = this.cambioFechaDevolucion.bind(this);
    this.mostrar = this.mostrar.bind(this);
    this.eliminar = this.eliminar.bind(this);
    this.guardar = this.guardar.bind(this);
  }
  render() {
    return (<div>
      <h1>Lista de Prestamos</h1>
      <table border="1">
      <thead>
        <tr>
          <th>ID Libro</th>
          <th>ID Usuario</th>
          <th>Fecha de Prestamo</th>
          <th>Fecha de Devolución</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {this.state.prestamos.map( (prestamo, index) => {
          return (
            <tr key={prestamo.id}>
              <td>{prestamo.id_libro}</td>
              <td>{prestamo.id_usuario}</td>
              <td>{prestamo.fec_prestamo}</td>
              <td>{prestamo.fec_devolucion}</td>
              <td>
                <button onClick={()=>this.mostrar(prestamo.id,index)}>Editar</button>
                <button onClick={()=>this.eliminar(prestamo.id)}>Eliminar</button>
              </td>
            </tr>
          );
        })}
      </tbody>
      </table>
      <hr />
      <h1>{this.state.titulo}</h1>
      <form onSubmit={this.guardar}>
          <input type="hidden" value={this.state.id}></input>
        <p>
          Ingrese ID Libro:
          <input type="number" value={this.state.id_libro} onChange={this.cambioLibro} />
        </p>
        <p>
          Ingrese ID Usuario:
          <input type="number" value={this.state.id_usuario} onChange={this.cambioUsuario} />
        </p>
        <p>
          Ingrese Fecha de Prestamo:
          <input type="date" value={this.state.fec_prestamo} onChange={this.cambioFechaPrestamo} />
        </p>
        <p>
          Ingrese Fecha de Devolución:
          <input type="date" value={this.state.fec_devolucion} onChange={this.cambioFechaDevolucion} />
        </p>
        <p><input type="submit" /></p>
      </form>
      </div>
      
      
      )
  }



  componentWillMount(){
    axios.get('http://127.0.0.1:8000/prestamo/')
    .then(res => {
      this.setState({ prestamos: res.data })
    });
  }

  //Metodos para actualizar

  cambioLibro(e){
    this.setState({
      id_libro: e.target.value
    })
  }

  cambioUsuario(e){
    this.setState({
      id_usuario: e.target.value
    })
  }

  cambioFechaPrestamo(e){
    this.setState({
      fec_prestamo: e.target.value
    })
  }

  cambioFechaDevolucion(e){
    this.setState({
      fec_devolucion: e.target.value
    })
  }

  //Mostrar

  mostrar(cod, index){
    axios.get('http://127.0.0.1:8000/prestamo/'+cod+'/')
    .then(res => {
      this.setState({
        pos: index,
        titulo: 'Editar',
        id: res.data.id,
        id_libro: res.data.id_libro,
        id_usuario: res.data.id_usuario,
        fec_prestamo: res.data.fec_prestamo,
        fec_devolucion: res.data.fec_devolucion
      })
    });
  }

  //Guardar

  guardar(e){
    e.preventDefault();
    let cod = this.state.id;
    let datos = {
      id: this.state.id,
      id_libro: this.state.id_libro,
      id_usuario : this.state.id_usuario,
      fec_prestamo : this.state.fec_prestamo,
      fec_devolucion : this.state.fec_devolucion
    }
    if(cod>0){ //Editar un registro
      axios.put('http://127.0.0.1:8000/prestamo/'+cod+'/', datos )
      .then(res => {
        let indx = this.state.pos;
        this.state.prestamos[indx] = res.data;
        var temp = this.state.prestamos;
        this.setState({
          pos: null,
          titulo: 'Nuevo',
          id: 0,
          id_libro: 0,
          id_usuario: 0,
          fec_prestamo: '',
          fec_devolucion: '',
          prestamos: temp
        });
      }).catch((error)=>{
        console.log(error.toString());
      });
    } else { //Nuevo Registro
      axios.post('http://127.0.0.1:8000/prestamo/', datos )
      .then(res => {
        this.state.prestamos.push(res.data);
        var temp = this.state.prestamos;
        this.setState({
          id: 0,
          id_libro: 0,
          id_usuario: 0,
          fec_prestamo: '',
          fec_devolucion: '',
          prestamos: temp
        });
      }).catch((error)=>{
        console.log(error.toString());
      });
    }
  }

  //Metodo Eliminar
  eliminar(cod){
    let rpta = window.confirm("Desea Eliminar?");
    if(rpta){
      axios.delete('http://127.0.0.1:8000/prestamo/'+cod+'/')
      .then(res =>{
        var temp = this.state.prestamos.filter((prestamos)=>prestamos.id !== cod);
        this.setState({
          prestamos: temp
        })
      });
    }
  }

}
export default App;
