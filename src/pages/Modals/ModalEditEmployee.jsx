import React, { useState, useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FormGroup, Label, Input } from 'reactstrap';
import  { EditEmployee }  from '../../httpService.js';
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'
const modelEmployee = {
    id: 0,
    firstName: "",
    lastName: "",
    doj: "",
    designation: "",
    email: ""
}


const ModalEditEmployee = ({showModalEditEmployee, setshowModalEditEmployee, employeeWithSkills, getAllEmployees}) => {
  const { token } = useSelector((state) => state.auth.user)
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timerProgressBar: true,
  })
  const [employee, setEmployee] =  useState(modelEmployee);
  useEffect ( () => {
    if (employeeWithSkills.length !== 0){

      setEmployee(employeeWithSkills)
    }

  }, [employeeWithSkills])


    

    const updateData = (e) => {
        console.log(e.target.name + " : " + e.target.value)
        setEmployee({
          ...employee,
          [e.target.name]: e.target.value
        })
        console.log(employee)
        console.log(employeeWithSkills)
    }
    
    const editEmployee = async (employee, token) => {
        console.log('click')
        const response = await EditEmployee(employee, token)
        if (response.status === 200){
          await Toast.fire({
            title: `The Employee # ${employee.id} has been modified`,
            icon: 'success',
            timer: 1500,
            position: "top"
          })
          getAllEmployees(token)
          handleClose();  
        }

        console.log(employee)
    }

    const handleClose = () => {setshowModalEditEmployee(false);}
    return (
        <Modal 
          show={showModalEditEmployee}
          onHide={handleClose}
          >
          <Modal.Header closeButton>
            <Modal.Title>Edit Employee</Modal.Title>
          </Modal.Header>
    
          <Modal.Body>

                <FormGroup>
                    <Label>First Name</Label>
                    <Input type='text' name='firstName' onChange={(e) => updateData(e)}  defaultValue = {employeeWithSkills && employeeWithSkills.firstName}/>
                </FormGroup>
                <FormGroup>
                    <Label>Last Name</Label>
                    <Input type='text' name = 'lastName' onChange={(e) => updateData(e)} defaultValue = {employeeWithSkills && employeeWithSkills.lastName}/>
                </FormGroup>
                <FormGroup>
                    <Label >Email</Label>
                    <Input type='email' name = 'email' onChange={(e) => updateData(e)} defaultValue = {employeeWithSkills && employeeWithSkills.email}/>
                </FormGroup>                
                <FormGroup>
                    <Label>Date of Joining</Label>
                    <Input type='date' name = 'doj' onChange={(e) => updateData(e)} defaultValue = {employeeWithSkills && employeeWithSkills.doj}/>
                </FormGroup>
                <FormGroup>
                    <Label>Designation</Label>
                    <Input type='text' name = 'designation' onChange={(e) => updateData(e)} defaultValue = {employeeWithSkills && employeeWithSkills.designation}/>
                </FormGroup>

          </Modal.Body>
    
          <Modal.Footer>
            <Button variant="success" onClick={() => editEmployee(employee, token)}>Save changes</Button>
          </Modal.Footer>
        </Modal>
      );
}

export default ModalEditEmployee