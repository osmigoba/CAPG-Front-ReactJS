import React, {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FormGroup, Label, Input } from 'reactstrap';
import  { AddSkillToEmployee }  from '../../httpService.js';
import { useSelector} from 'react-redux'
import Swal from 'sweetalert2'
let modelSkillAdd = {

    skillID: 1,
    employeeID: 1,
    levelRatingId: 1,
    experience: 1
}

const ModalAssignSkill = ({employee, showModalAddskills, setshowModalAddskills, expertises, skills}) => {
  const { token } = useSelector((state) => state.auth.user)
    const [skillAdd, setSkillAdd] = useState( modelSkillAdd )
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timerProgressBar: true,
    })
    useEffect ( () => {
      if (employee.length !== 0){
        modelSkillAdd.employeeID = 1;
        modelSkillAdd.skillID = 1;
        modelSkillAdd.levelRatingId = 1;
        modelSkillAdd.experience = 1;
        }
      console.log('entre');
      }, [])

          //To close the modal
    const handleClose = () => {
      setshowModalAddskills(false); 
    }


      const saveSkill = async (employeeid, token) => {
        skillAdd.employeeID = employeeid
        console.log(skillAdd)
        if (skillAdd.skillID === 1) { 
          skillAdd.skillID = skills[0].id;
        }
        if (skillAdd.levelRatingId === 1){
          skillAdd.levelRatingId = expertises[0].id
        }
        const response = await AddSkillToEmployee(skillAdd, token)
        if (response.status === 201){
          
            await Toast.fire({
              title: `The skill has been assigned`,
              icon: 'success',
              timer: 2000,
              position: "top"
            })
            console.log(modelSkillAdd)
            setSkillAdd(modelSkillAdd);
            handleClose();
          }
        
        if (response.status === 400){
          await Toast.fire({
            title: `🤨 This skill already exists`,
            icon: 'error',
            timer: 1500,
            position: "top"
          })
        }
      }

      const updateDate = (e) => {
        console.log(e.target.name + " : " + e.target.value)
        setSkillAdd({
            ...skillAdd,
            [e.target.name]: parseInt(e.target.value),
          })
          console.log(skillAdd)
        }  
    
  return (
    <Modal 
    show={showModalAddskills}
    onHide={handleClose}
    >
    <Modal.Header closeButton>
      <Modal.Title>Add Skill</Modal.Title>
    </Modal.Header>

    <Modal.Body>


        <FormGroup>
            <Label >Select The Expert Level</Label>
            <Input type="select"  onChange={(e) => updateDate(e)} name="levelRatingId" >
                { expertises.map( (expertise, index) =>(
                    <option key={index} value={expertise.id} >{expertise.id}. {expertise.name}</option> 
                )) }
            </Input>
        </FormGroup>  

        <FormGroup>
            <Label >Select The Skill</Label>
            <Input type="select" onChange={(e) => updateDate(e)} name="skillID">
            { skills.map( (skill, index) =>(
                <option key={index} value={skill.id}> {skill.skill} </option> 
            ))}
            </Input>
        </FormGroup>  

        <FormGroup>
            <Label >Type the Years of Experience </Label>
            <Input type="text" placeholder="1" onChange={(e) => updateDate(e)} name="experience" >
            </Input>
        </FormGroup>          

    </Modal.Body>

    <Modal.Footer>
      {/* <Button variant="secondary" onClick={() => handleClose()}>Close</Button> */}
      <Button variant="success" onClick={() => saveSkill(employee.id, token)}>Save</Button>
    </Modal.Footer>
  </Modal>
  )
}

export default ModalAssignSkill