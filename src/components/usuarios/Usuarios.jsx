import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Pagination, Card, Button, Spin, Input, notification, Modal } from 'antd';
import { Box, Typography } from '@mui/joy';
import Swal from 'sweetalert2';

const Usuarios = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [donationsData, setDonationsData] = useState({});
  const [loadingDonations, setLoadingDonations] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const loggedInUserId = JSON.parse(localStorage.getItem('profileInfo')).email
  const [userIdToDisable, setUserIdToDisable] = useState(null);

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchEmail.toLowerCase())
  );
  const fetchDonations = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/donations/donor/${userId}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        }
      });
      return response.data.length; // La cantidad de donaciones es el tamaño de la lista
    } catch (error) {
      console.error('Error al obtener las donaciones', error);
      return 0; // En caso de error, devolvemos 0
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {

      setLoading(true);

      try {
        const response = await axios.get('http://localhost:8080/api/adminuser/get-all-users', {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`,
          }
        });
        const activeUsers = response.data.userEntityList.filter(user => user.active && user.email !== loggedInUserId);

        setUsers(activeUsers);
        setTotalUsers(response.data.total);
        setLoadingDonations(true);
        const donations = {};
        for (let user of activeUsers) {
          const userDonations = await fetchDonations(user.id);
          donations[user.id] = userDonations;
        }
        setDonationsData(donations);
      } catch (error) {
        console.error('Error al obtener los usuarios', error);
      } finally {
        setLoading(false);
        setLoadingDonations(false);
      }
    };

    fetchUsers();
  }, []);

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Correo Electrónico',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Numero de Telefono',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Rol',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Donaciones realizadas',
      key: 'donations',
      render: (_, record) => {
        if (loadingDonations) {
          return <Spin />;
        }
        return donationsData[record.id] !== undefined ? donationsData[record.id] : 'No Disponible';
      },
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record) => (
        <Button onClick={() => handleDisableClick(record.id)} danger>
          Deshabilitar
        </Button>
      ),
    },
  ];

  const onPageChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  // Botón con confirmación de SweetAlert
  const handleDisableClick = (userId) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción deshabilitará al usuario. ¿Deseas continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, deshabilitar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: 'black',
      cancelButtonColor: 'gray',
    }).then((result) => {
      if (result.isConfirmed) {
        disableUser(userId);
      }
    });
  };


  const disableUser = async (userId) => {
    try {
      const response = await axios.patch(
        `http://localhost:8080/api/admin/disable-user/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
  
      if (response.status === 200) {
        // Muestra SweetAlert de éxito
        Swal.fire({
          title: 'Usuario deshabilitado',
          text: 'El usuario ha sido deshabilitado correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        }).then(() => {
          // Recarga la página al aceptar
          window.location.reload();
        });
      }
    } catch (error) {
      console.error('Error al deshabilitar al usuario', error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un error al deshabilitar el usuario.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
    }
  };
  

  return (
    <>

      <div className='p-3'>
        <Box sx={{ px: { xs: 2, md: 6 } }}>
          <Typography level="h2" component="h1" sx={{ mb: 2, color: 'black' }}>
            Gestión de usuarios
          </Typography>
        </Box>
        <div className='flex flex-row justify-between items-center p-1'>
          <Box
            sx={{
              bgcolor: "background.level3",
              p: 2,
              borderRadius: "sm",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography level="body2" sx={{ fontWeight: "bolder", fontSize: 14 }}>
              <p className='font-medium text-sm'>Visualiza y gestiona los usuarios activos en el sistema. Puedes consultar su información y deshabilitar cuentas cuando sea necesario</p>
            </Typography>
          </Box>
          <div className='flex-1'>
            <div style={{ backgroundColor: 'black' }} className="p-2 rounded-lg shadow-md flex items-center justify-center h-16 w-1/2 mx-auto">
              <h1 className='text-white font-semibold'>Numero de usuarios: {users.length}</h1>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '5px 20px 0px 20px', width: '100%' }} className="flex flex-col items-center justify-center">
        <div className="mb-4 ">
          <Input
            placeholder="Buscar por correo electrónico"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            style={{ width: '300px' }}
          />
        </div>
        <Card title="Lista de Usuarios">
          <Table
            columns={columns}
            dataSource={filteredUsers}
            rowKey="id"
            loading={loading}
            pagination={false}
            scroll={{ y: 200 }}
          />
          <Pagination
            current={page}
            pageSize={pageSize}
            total={totalUsers}
            onChange={onPageChange}
            showSizeChanger
            pageSizeOptions={['10', '20', '30']}
          />
        </Card>
      </div>
    </>
  );
};

export default Usuarios;
