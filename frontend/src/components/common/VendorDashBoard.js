import { useState, useEffect } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Checkbox from '@mui/material/Checkbox';
import Divider from "@mui/material/Divider";
import Autocomplete from "@mui/material/Autocomplete";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import jwt_decode from "jwt-decode";
import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { DataGrid, GridApi, GridToolbarContainer, GridToolbar, GridCellValue, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
var token = localStorage.getItem("token");
var host = window.location.hostname

if (token) {
  var decoded = jwt_decode(token);
}


console.log(decoded);
const VendorDashBoard = (props) => {
  const [details, setDetails] = useState([]);
  const [add, setAdd] = useState(0);
  const [tag, setTag] = useState('');
  const [tagarr, setTagarr] = useState([]);
  const [edit, setEdit] = useState(0);
  const [items, setItems] = useState([]);
  const [addons, setaddons] = useState([]);
  const [name, setName] = useState(null);
  const [aname, setAname] = useState(null);
  const [aprice, setAPrice] = useState(null);
  const [price, setPrice] = useState(null);
  const [Veg, setveg] = useState(null);
  const [EditItem, setEditItem] = useState(null);
  const [rating, setRate] = useState(0);

  const onChangename = (event) => {
    setName(event.target.value);
  };

  const onChangePrice = (event) => {
    setPrice(event.target.value);
  };
  const onChangeVeg = (event) => {
    setveg(event.target.value);
  };
  const onChangeTags = (event,Item) => {
    setTag(event.target.value);
  };

  const onChangeAPrice = (event) => {
    setAPrice(event.target.value);
  };
  const onChangeAname = (event) => {
    setAname(event.target.value);
  };

  const handleEdit = (event, Item) => {
    setEditItem(Item);
    console.log("HI")
    setEdit(1);

    /*   setRows((prevRows) => {
        const rowToUpdateIndex = randomInt(0, rows.length - 1);
    
        return prevRows.map((row, index) =>
          index === rowToUpdateIndex ? { ...row, username: randomUserName() } : row,
        );
      }); */
  };
  const handleDelete = (event, Item) => {

    axios.delete('"http://"+host+"/api/user/VendorDashBoard', { data: Item }).then(
      console.log("deleted")
    )
    window.location.reload();
  };
  const addAddONS = (event) => {
    console.log("okay");
    setaddons(addons, addons.push({ name: aname, price: aprice }))

    console.log(addons);
  }
  const addTags = (event) => {
    setTagarr(tagarr, tagarr.push(tag ))
    console.log(tagarr)
  }
  const handleAdd = (event) => {

    console.log("ADD")
    setAdd(1);

  };
  console.log(details)
  const handleItemAdd = (event) => {
    if (add) {
      console.log("adding")
      const newItem = {
        id: details.vendor._id,
        name: name,
        price: price,
        rating: 0,
        isVeg: Veg === "on" ? 1 : 0
      };
      newItem.addOn = addons
      newItem.tags = tagarr
      console.log(newItem)
      axios
        .put("http://"+host+"/api/user/VendorDashBoard", { item: newItem })
        .then((response) => {
          alert("Added\t" + response.data.vendor.name);
          console.log(response.data);

        }
        )
        .catch(error => {
          console.log(error.response);
        })

      setAdd(0);
      setaddons(addons, [])
      setTagarr(tagarr, [])
      //window. location. reload();
    }
    else {
      console.log("editing")
      EditItem.name = name === null ? EditItem.name : name;
      EditItem.price = price === null ? EditItem.price : price;
      EditItem.isVeg = Veg === null ? EditItem.isVeg : (Veg === "on" ? 1 : 0);
      EditItem.addons = addons === [] ? EditItem.addons : addons;

      axios
        .put("http://"+host+"/api/user/editItem", { item: EditItem })
        .then((response) => {
          alert("Edited\t" + response.data.vendor.name);
          console.log(response.data);

        }
        )
        .catch(error => {
          console.log(error.response);
        })

      setEdit(0);
      setaddons(addons, [])
      // window. location. reload();

    }
  };

  useEffect(() => {
    axios
      .post("http://"+host+"/api/user/VendorDashBoard", {
        id: decoded
      }) // unimplemented
      .then((response) => {
        setDetails(response.data);
        setItems(response.data.items);
        //setRows(response.data.vendor.menu)
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);



  return (
    <div>
      <ListItem >
        {(!add || !edit) && <AddIcon
          sx={{ marginLeft: "1350px" }}
          variant="contained"
          color="primary"
          onClick={(event) => {
            handleAdd(event);
          }}
        />
        }
      </ListItem>
      {(!!add || !!edit) && <Grid container>
        <Grid item xs={12} md={3} lg={3}>
          <List component="nav" aria-label="mailbox folders">
            <ListItem text>
              {!edit && <h1>ADD ITEM</h1>}
              {!!edit && <h1>EDIT ITEM</h1>}
            </ListItem>
          </List>
        </Grid>
      </Grid>
      }
      <  Grid container>
        {(!!add || !!edit) && <Grid item xs={12} md={3} lg={3}>
          <List component="nav" aria-label="mailbox folders">
            <ListItem>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    id="standard-basic"
                    label="Name"
                    fullWidth={true}
                    onChange={onChangename}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="standard-basic"
                    label="Price"
                    fullWidth={true}
                    onChange={onChangePrice}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel control={<Checkbox
                    onChange={onChangeVeg}

                    inputProps={{ 'aria-label': 'controlled' }}
                  />} label="Veg" />

                  <ListItem text>
                    {!edit && <h4>ADD ONS</h4>}
                    {!!edit && <h4>Reset ADD ONS</h4>}
                  </ListItem>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        id="standard-basic"
                        label="Name"
                        fullWidth={true}
                        onChange={onChangeAname}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        id="standard-basic"
                        label="Price"
                        fullWidth={true}
                        onChange={onChangeAPrice}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button onClick={addAddONS}>
                        Add
                      </Button>
                      {!edit && <Grid item xs={6}>
                      <ListItem text>
                        <h4>TAGS</h4>
                      </ListItem>
                      <TextField
                        id="standard-basic"
                        label="TAGS"
                        fullWidth={true}
                        onChange={onChangeTags}
                      />
                      <Button onClick={addTags}>
                        Add Tag
                      </Button>
                    </Grid>}
                    </Grid>
                    
                  </Grid>
                </Grid>
              </Grid>

            </ListItem>
            <ListItem >
              <Button variant="contained" onClick={handleItemAdd}>
                {!edit && <h3>Add Item</h3>}
                {!!edit && <h3>Edit Item</h3>}
              </Button>


            </ListItem>
          </List>
        </Grid>
        }
        <Grid item xs={12} md={9} lg={9}>
          <Paper>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Item</TableCell>
                  <TableCell>
                    Price
                  </TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Vegiterian</TableCell>


                </TableRow>
              </TableHead>
              {items && <TableBody>
                {items.map((item, ind) => (
                  <TableRow key={ind}>
                    <TableCell>{ind}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>{item.rating}</TableCell>
                    <TableCell>{(item.isVeg) ? "Yes" : "No"}</TableCell>
                    <TableCell><EditIcon
                      variant="contained"
                      color="primary"
                      onClick={(event) => {
                        handleEdit(event, item);
                      }}
                    /></TableCell>
                    <TableCell>< DeleteIcon
                      variant="contained"
                      color="primary"
                      onClick={(event) => {
                        handleDelete(event, item);
                      }}
                    /></TableCell>
                  </TableRow>
                ))}
              </TableBody>}
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default VendorDashBoard;
