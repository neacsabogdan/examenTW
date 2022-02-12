import * as React from 'react';
import {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import {DataGridPro, GridToolbar} from '@mui/x-data-grid-pro';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {styled} from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import axios from "axios";
import {Backdrop, Fade, Grid, Modal, TextField} from "@mui/material";
import './style.css';
import {Link} from "react-router-dom";

const StyledBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    height: 500,
    width: '100%',
    '& .MuiFormGroup-options': {
        alignItems: 'center',
        paddingBottom: theme.spacing(1),
        '& > div': {
            minWidth: 100,
            margin: theme.spacing(2),
            marginLeft: 0,
        },
    },
}));

const style = {
    position: 'absolute',
    top: '0',
    right:'0',
    width: 600,
    height:'100%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function SettingsPanel(props) {
    const { onApply } = props;
    const [selectedPaginationValue, setSelectedPaginationValue] = React.useState(-1);

    const handlePaginationChange = React.useCallback((event) => {
        setSelectedPaginationValue(event.target.value);
    }, []);


    const handleApplyChanges = React.useCallback(() => {
        onApply({
            pagesize: selectedPaginationValue,
        });
    }, [selectedPaginationValue,onApply]);

    return (
        <FormGroup className="MuiFormGroup-options" row>
            <FormControl variant="standard">
                <InputLabel>Page Size</InputLabel>
                <Select value={selectedPaginationValue} onChange={handlePaginationChange}>
                    <MenuItem value={-1}>off</MenuItem>
                    <MenuItem value={0}>auto</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                </Select>
            </FormControl>
            <Button
                size="small"
                variant="outlined"
                color="primary"
                onClick={handleApplyChanges}
            >
                <KeyboardArrowRightIcon fontSize="small" /> Apply
            </Button>
        </FormGroup>
    );
}

SettingsPanel.propTypes = {
    onApply: PropTypes.func.isRequired
};

export default function Playlists() {

    const [playlists,setPlaylists]=useState([]);
    const [count,setCount]=useState(1);
    const [isModalOpened, setIsModalOpened] = useState(false);
    const [isEditing,setIsEditing]=useState(false);
    const [playlist,setPlaylist]=useState({description:'',date:''});

    const handleModalOpen = () => {
        setIsModalOpened(true);
    };

    const handleInputChange = (e) => {
        setPlaylist({...playlist, [e.target.name]:e.target.value});
    }

    const handleModalClose = () => {
        setIsModalOpened(false);
        setIsEditing(false);
    };

    const handleEditItem = (row) => {
        const item=(playlists.find(row2=>row2.id===row.id));
        setPlaylist({
            id:item.id,
            description:item.description,
            date:item.date
        })
        setIsEditing(true);
        handleModalOpen();
    }

    const handleDeleteItem = (row) => {
        const item=(playlists.find(row2=>row2.id===row.id));
        axios.delete(`http://localhost:8080/playlist/${item.id}`)
            .then(() => {
                console.log('Deleted item!');
                setCount(count+1);

            })
            .catch((error) => {
                console.log('Error:',error);
                alert(error.response.data.message);

            })
    }

    const handleEdit = () => {
        axios.put(`http://localhost:8080/playlist/${playlist.id}`,playlist)
            .then(() =>{
                setCount(count+1);

                handleModalClose();
            })
            .catch(error => {
                console.log('Error',error);
                alert(error.response.data.message);

            })

    }

    const handleShip = () => {
        axios.post('http://localhost:8080/playlist',playlist)
            .then(res => {
                setCount(count+1);
                handleModalClose()
            })
            .catch(error => {
                console.log('Error',error);
                alert(error.response.data.message);
            })

    }

    const handleAddShip = () => {
        setPlaylist({description:'',date:''});
        setIsEditing(false)
        handleModalOpen()
    }

    useEffect(() => {
        axios.get('http://localhost:8080/playlist')
            .then(res => {
                setPlaylists(res.data);
                console.log('Playlists:',res.data);
            })
    },[count])
    const columns=[
        {field:"id",hide:true},
        {field:"description",headerName:"Description",width:210},
        {field:"date",headerName:"Date",width:210},
        {field:"songs",headerName:"Songs", width: 210,
            renderCell: (params) => {
                return (
                    <Link to={`/song/${params.row.id}`}>
                        <Button variant="contained" sx={{mr:1}}>Songs</Button> </Link>
                )
            }
        },
        {field:"edit",headerName:"Edit", width: 210,
        renderCell: (params) => {
            return (
                <Button variant="contained" sx={{mr:1}} onClick={()=> handleEditItem(params.row)}>Edit</Button>
            )
        }
        },
        {field:"delete",headerName:"Delete", width: 210,
            renderCell: (params) => {
                return (
                    <Button variant="contained" color="error" sx={{mr:1}} onClick={()=> handleDeleteItem(params.row)}>Delete</Button>
                )
            }
        }
    ]
    const [pagination, setPagination] = React.useState({
        pagination: false,
        autoPageSize: false,
        pageSize: undefined,
    });
    const handleApplyClick = (settings) => {

        const newPaginationSettings = {
            pagination: settings.pagesize !== -1,
            autoPageSize: settings.pagesize === 0,
            pageSize: settings.pagesize > 0 ? settings.pagesize : undefined,
        };

        setPagination((currentPaginationSettings) => {
            if (
                currentPaginationSettings.pagination === newPaginationSettings.pagination &&
                currentPaginationSettings.autoPageSize ===
                newPaginationSettings.autoPageSize &&
                currentPaginationSettings.pageSize === newPaginationSettings.pageSize
            ) {
                return currentPaginationSettings;
            }
            return newPaginationSettings;
        });
    };

    const DataGridComponent =  DataGridPro;
    return (
        <div className={"container"}>
            <h2 className={"title"}>Playlists</h2>
            <Button className={"btn"} variant={"outlined"} onClick={handleAddShip}>Add a playlist</Button>
            <div className={"datagrid-container"}>
                <StyledBox>

                    <SettingsPanel
                        onApply={handleApplyClick}
                    />
                    {playlists && (
                        <DataGridComponent
                            columns={columns}
                            rows={playlists}
                            components={{
                                Toolbar: GridToolbar,
                            }}
                            checkboxSelection
                            disableSelectionOnClick
                            rowThreshold={0}
                            {...pagination}
                        />
                    )}

                </StyledBox>
            </div>

    <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={isModalOpened}
        onClose={handleModalClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
            timeout: 500,
        }}
    >
        <Fade in={isModalOpened}>
            <Box sx={style}>
                <div className="modal-header">Add a playlist</div>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="description"
                            label="Description"
                            name="description"
                            value={playlist.description}
                            onChange={handleInputChange}
                            autoFocus
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="date"
                            label="Date"
                            name="date"
                            value={playlist.date}
                            onChange={handleInputChange}
                            autoFocus
                        />
                    </Grid>

                    <Grid item xs={12} direction={"row"} justify={"center"} alignItems={"center"}>
                        {isEditing ? <Button
                                fullWidth
                                variant="contained"
                                color="secondary"
                                onClick={handleEdit}
                            >
                                Edit
                            </Button> :
                            <Button
                                fullWidth
                                variant="contained"
                                color="secondary"
                                onClick={handleShip}
                            >
                                Add
                            </Button>}

                    </Grid>


                </Grid>

            </Box>
        </Fade>
    </Modal>
    </div>
    );
}
