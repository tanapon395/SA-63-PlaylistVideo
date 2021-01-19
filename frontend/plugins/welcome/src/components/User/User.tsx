import React, { FC, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Content, Header, Page, pageTheme } from '@backstage/core';
import SaveIcon from '@material-ui/icons/Save'; // icon save
import Swal from 'sweetalert2'; // alert
import {
  Container,
  Grid,
  TextField,
  Avatar,
  Button,
} from '@material-ui/core';
import { DefaultApi } from '../../services/apis'; // Api Gennerate From Command

// header css
const HeaderCustom = {
  minHeight: '50px',
};

// css style
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    textAlign: 'right',
  },
  formControl: {
    width: 300,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    width: 300,
  },
}));

interface userI {
    student_id: string;
    name: string;
    identification_number: string;
    email: string;
    age: number;
}

const WatchVideo: FC<{}> = () => {
  const classes = useStyles();
  const http = new DefaultApi();

  const [user, setUser] = React.useState<Partial<userI>>({});
  const [studentIDError, setStudentIDError] = React.useState('');
  const [identificationNumberError, setIdentificationNumberError] = React.useState('');
  const [emailError, setEmailError] = React.useState('');

  // alert setting
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: toast => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  // Lifecycle Hooks
  useEffect(() => {}, []);

  // set data to object user
  const handleChange = (event: React.ChangeEvent<{ id?: string; value: any }>) => {
    const id = event.target.id as keyof typeof WatchVideo;
    const { value } = event.target;
    const validateValue = value.toString()
    checkPattern(id, validateValue)
    setUser({ ...user, [id]: value });
  };


  // ฟังก์ชั่นสำหรับ validate อีเมล
  const validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  // ฟังก์ชั่นสำหรับ validate เลขประจำตัวประชาชน
  const validateIdentificationNumber = (val: string) => {
    return val.length == 13 ? true : false;
  }

  // ฟังก์ชั่นสำหรับ validate รหัสนักศึกษา
  const validateStudentID = (val: string) => {
    return val.match("[BMD]\\d{7}");
  }

  // สำหรับตรวจสอบรูปแบบข้อมูลที่กรอก ว่าเป็นไปตามที่กำหนดหรือไม่
  const checkPattern  = (id: string, value: string) => {
    switch(id) {
      case 'student_id':
        validateStudentID(value) ? setStudentIDError('') : setStudentIDError('รหัสนักศึกษาขึ้นต้นด้วย B,M,D ตามด้วยตัวเลข 7 ตัว');
        return;
      case 'identification_number':
        validateIdentificationNumber(value) ? setIdentificationNumberError('') : setIdentificationNumberError('เลขประจำตัวประชาชน 13 หลัก');
        return;
      case 'email':
        validateEmail(value) ? setEmailError('') : setEmailError('รูปแบบอีเมลไม่ถูกต้อง')
        return;
      default:
        return;
    }
  }

  const alertMessage = (icon: any, title: any) => {
    Toast.fire({
      icon: icon,
      title: title,
    });
  }

  const checkCaseSaveError = (field: string) => {
    switch(field) {
      case 'student_id':
        alertMessage("error","รหัสนักศึกษาขึ้นต้นด้วย B,M,D ตามด้วยตัวเลข 7 ตัว");
        return;
      case 'identification_number':
        alertMessage("error","เลขประจำตัวประชาชน 13 หลัก");
        return;
      case 'email':
        alertMessage("error","รูปแบบอีเมลไม่ถูกต้อง");
        return;
      default:
        alertMessage("error","บันทึกข้อมูลไม่สำเร็จ");
        return;
    }
  }

  const save = async () => {
    const apiUrl = 'http://localhost:8080/api/v1/users';
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    };

    fetch(apiUrl, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.status === true) {
          Toast.fire({
            icon: 'success',
            title: 'บันทึกข้อมูลสำเร็จ',
          });
        } else {
          checkCaseSaveError(data.error.Name)
        }
      });
  };

  return (
    <Page theme={pageTheme.home}>
      <Header style={HeaderCustom} title={`User`}>
        <Avatar alt="Remy Sharp" src="../../image/account.jpg" />
        <div style={{ marginLeft: 10 }}>Tanapon Kongjaroensuk</div>
      </Header>
      <Content>
        <Container maxWidth="md">
          <Grid container spacing={3}>
            <Grid item xs={12}></Grid>
            <Grid item xs={3}>
              <div className={classes.paper}>รหัสนักศึกษา</div>
            </Grid>
            <Grid item xs={9}>
              <TextField
                error = {studentIDError ? true : false}
                className={classes.formControl}
                id="student_id"
                label="รหัสนักศึกษา"
                variant="outlined"
                helperText= {studentIDError}
                value={user.student_id || ''}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={3}>
              <div className={classes.paper}>ชื่อ - สกุล</div>
            </Grid>
            <Grid item xs={9}>
              <TextField
                className={classes.formControl}
                id="name"
                label="ชื่อ - สกุล"
                value={user.name || ''}
                variant="outlined"
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={3}>
              <div className={classes.paper}>เลขประจำตัวประชาชน</div>
            </Grid>
            <Grid item xs={9}>
              <TextField
                error = {identificationNumberError ? true : false}
                className={classes.formControl}
                id="identification_number"
                label="เลขประจำตัวประชาชน"
                inputProps={{ maxLength: 13 }}
                helperText= {identificationNumberError}
                value={user.identification_number || ''}
                variant="outlined"
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={3}>
              <div className={classes.paper}>อีเมล</div>
            </Grid>
            <Grid item xs={9}>
              <TextField
                error = {emailError ? true : false}
                className={classes.formControl}
                id="email"
                label="อีเมล"
                helperText= {emailError}
                value={user.email || ''}
                variant="outlined"
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={3}>
              <div className={classes.paper}>อายุ</div>
            </Grid>
            <Grid item xs={9}>
              <TextField
                className={classes.formControl}
                id="age"
                label="อายุ"
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
                value={user.age || ''}
                variant="outlined"
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={3}></Grid>
            <Grid item xs={9}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<SaveIcon />}
                onClick={save}
              >
                บันทึก
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Content>
    </Page>
  );
};

export default WatchVideo;
