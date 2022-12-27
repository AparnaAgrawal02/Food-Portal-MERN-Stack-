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
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import jwt_decode from "jwt-decode";
var host = window.location.hostname



var token = localStorage.getItem("token");
if (token) {
  var decoded = jwt_decode(token);
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const BuyerDashBoard = (props) => {
  const theme = useTheme();
  const [items, setItems] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [addOn, setAddOn] = useState([]);
  const [fav, setFav] = useState([]);
  const [details, setDetails] = useState([]);
  const [searcheditems, setSItems] = useState([]);
  const [names, setnames] = useState([]);
  const [databaseItems, setDItem] = useState([]);
  const [sortedUsers, setSortedUsers] = useState([]);
  const [sortName, setSortName] = useState(true);
  const [sortRate, setSortRate] = useState(true);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(-1);
  const [searchText, setSearchText] = useState("");
  const [Veg, setveg] = useState(null);
  const [shopNames, setShopNames] = useState([]);
  const [TagNames, setTagNames] = useState([]);

  useEffect(() => {
    axios
      .post("http://"+host+"/api/user/buyer", {
        id: decoded
      }) // unimplemented
      .then((res) => {
        setDetails(res.data);
        console.log(details);
        setFav(res.data.buyer.favourites);
        console.log(fav);
        //setRows(response.data.vendor.menu)
        console.log(res.data);
      })
      .catch(function (error) {
        console.log(error);
      });

    axios
      .get("http://"+host+"/api/food")
      .then((response) => {
        setItems(response.data);
        setDItem(response.data);
        setSItems(response.data);
        //console.log(response.data)
        setSortedUsers(response.data);
        var s = new Set();

        for (let item in response.data) {
          s.add(response.data[item].vendor.shopName)

        }
        const arr = [...s]
        console.log(arr)
        setnames(arr)
        setSearchText("");
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  //console.log(details);

  const changeQuantity = (event) => {
    setQuantity(event.target.value)
  }
  const handleAddfav = (event, item) => {
    axios
      .put("http://"+host+"/api/user/buyer", { id: details.buyer._id, fav_id: item._id })
      .then((response) => {
        //alert("Added\t" + response.data.vendor.name);
        console.log(response.data);
      }
      )
      .catch(error => {
        console.log(error.response);
      })
    window.location.reload();
  }
  
  const handleDelfav = (event, item) => {
    console.log("F")
    axios
      .delete("http://"+host+"/api/user/buyer", { data: { id: details.buyer._id, fav_id: item._id } })
      .then((response) => {
        //alert("Added\t" + response.data.vendor.name);
        console.log(response.data);

      }
      )
      .catch(error => {
        console.log(error.response);
      })
    window.location.reload();
  }

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setShopNames(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
    handleFilters()

  };

  const handleTagChange = (event) => {
    const {
      target: { value },
    } = event;

    setTagNames(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
    handleFilters()

  };
  const handleAmmount = (cost) => {
    console.log(cost)
    axios
      .put("http://"+host+"/api/user/wallet", { id: details.buyer._id, amount: -1*cost })
      .then((response) => {
        //alert("Added\t" + response.data.vendor.name);
        console.log(response.data);
      }
      )
      .catch(error => {
        console.log(error.response);
      })
  }
  const handleOrder = (event, item) => {
    if (quantity * (addOn?addOn.price:0 + item.item.price) > details.buyer.amount) {
      alert(":/ Don't have enough Money! \t");
    }
    else {
    const order = {
      food: item.item,
      shop: item.vendor.shopName,
      quantity: quantity,
      cost: quantity * (addOn?addOn.price:0 + item.item.price),
      addOn: addOn,
      buyer:details.buyer._id

    }
    //console.log("works",order)
    axios
      .put("http://"+host+"/api/food/order", { id: details.buyer._id, order: order, vendor: item.vendor })
      .then((response) => {
        //alert("Added\t" + response.data.vendor.name);
        console.log(response.data);
        alert("ORDER PLACED\t");
      }
      )
      .catch(error => {
        console.log(error.response);
      })
      handleAmmount(quantity * ((addOn?addOn.price:0) + item.item.price));
    }
    setAddOn("");
    setQuantity(1);
  }
  const onChangeAddOns = (event) => {
    setAddOn(event.target.value)
  }
  const onChangeVeg = (event) => {
    setveg(event.target.value)
    handleFilters()
  }
  const handleFilters = () => {
    let search = []
    let Tempitems = [];

    for (let item in databaseItems) {
      console.log(databaseItems[item])
      //console.log([item].name,searchText,"ff")
      if (databaseItems[item].item.price > minPrice) {
        //console.log(databaseItems[item].price,minPrice)
        Tempitems.push(databaseItems[item])

      }
    }
    search = Tempitems.slice()
    // console.log(Tempitems,"fffffffffffffffffffff")
    Tempitems = [];
    if (maxPrice != -1) {
      for (let item in search) {
        //console.log(search[item])
        //console.log([item].name,searchText,"ff")
        if (search[item].item.price < maxPrice) {
          Tempitems.push(search[item])

        }
      }
      //setSItems(Tempitems)
      search = Tempitems.slice()
      //console.log(search,Tempitems,"fffffffffffffffffffff")
    }
    if (searchText != "") {
      Tempitems = [];
      for (let item in search) {
        //console.log(search[item])
        // console.log([item].item.name,searchText,"ff")
        if (search[item].item.name.includes(searchText)) {
          Tempitems.push(search[item])

        }
      }
      search = Tempitems.slice()
      // setSItems(Tempitems);
    }
    if (Veg === "on") {
      Tempitems = [];
      for (let item in search) {
        // console.log(search[item])
        //console.log(search[item].item.isVeg,"ff")
        if (search[item].item.isVeg) {
          Tempitems.push(search[item])

        }
      }
      search = Tempitems.slice()

    }
    //console.log(TagNames,search)
    if (shopNames.length) {

      Tempitems = [];
      for (let item in search) {
         //console.log(search[item].vendor.shopName,shopNames,search[item].vendor.shopName in shopNames)
        //console.log(search[item].item.isVeg,"ff")
        if (shopNames.includes(search[item].vendor.shopName)) {
          Tempitems.push(search[item])
        }

      }
      search = Tempitems.slice()
    }
    //console.log(TagNames,search)
    if (TagNames.length) {

      Tempitems = [];
      for (let item in search) {
        // console.log(search[item])
        console.log(search[item].item.tags,TagNames)
        const filteredArray = search[item].item.tags.filter(value => TagNames.includes(value));
        if (filteredArray.length) {
          Tempitems.push(search[item])
        }

      }
      search = Tempitems.slice()
    }
    console.log(search,Tempitems,"rrrrrrrrrrrrrrrrrr")

    setItems(search);
    console.log(items, "finall")
  }
  const sortPriceChange = () => {
    let itemsTemp = items;
    const flag = sortName;
    itemsTemp.sort((a, b) => {
      if (a.item.price != undefined && b.item.price != undefined) {
        return (1 - flag * 2) * (a.item.price - b.item.price);
      } else {
        return 1;
      }
    });
    setItems(itemsTemp);
    setSortName(!sortName);
  };
  const sortRatingChange = () => {
    console.log("works")
    let itemsTemp = items;
    const flag = sortRate;
    itemsTemp.sort((a, b) => {
      if (a.item.rating != undefined && b.item.rating != undefined) {
        return (1 - flag * 2) * (a.item.rating - b.item.rating);
      } else {
        return 1;
      }
    });
    setItems(itemsTemp);
    setSortRate(!sortRate);
  };

  const changeMax = (event) => {
    setMaxPrice(event.target.value);
  }
  const changeMin = (event) => {
    setMinPrice(event.target.value);

  }
  const HandleSearch = (event) => {
    setSearchText(event.target.value);
    handleFilters();
  };

  return (
    <Grid>
      <Grid container>
        <Grid item xs={12} md={3} lg={3}>
          <List component="nav" aria-label="mailbox folders">
            <ListItem text>
              <h1>Filters</h1>
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={12} md={9} lg={9}>

          <TextField
            id="standard-basic"
            label="Search"
            fullWidth={true}

            variant="outlined"

            InputProps={{
              endAdornment: (
                <InputAdornment>
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onChange={HandleSearch}

          />

        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12} md={3} lg={3}>
          <List component="nav" aria-label="mailbox folders">
            <ListItem>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  Price
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="standard-basic"
                    label="Enter Min"
                    fullWidth={true}
                    onChange={changeMin}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="standard-basic"
                    label="Enter Max"
                    fullWidth={true}
                    onChange={changeMax}
                  />
                </Grid>
              </Grid>

            </ListItem>
            <Grid>
              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="demo-multiple-chip-label">Vendor</InputLabel>
                <Select
                  labelId="demo-multiple-chip-label"
                  id="demo-multiple-chip"
                  multiple
                  value={shopNames}
                  onChange={handleChange}
                  input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {names.map((name) => (
                    <MenuItem
                      key={name}
                      value={name}
                      style={getStyles(name, shopNames, theme)}
                    >
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="demo-multiple-chip-label">Tag</InputLabel>
                <Select
                  labelId="demo-multiple-chip-label"
                  id="demo-multiple-chip"
                  multiple
                  value={TagNames}
                  onChange={handleTagChange}
                  input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >

                  <MenuItem value={"Drinks"}>Drinks</MenuItem>
                  <MenuItem value={"Sweet"}>Sweet</MenuItem>
                  <MenuItem value={"Cold"}>Cold</MenuItem>
                  <MenuItem value={"Hot"}>Hot</MenuItem>


                </Select>
              </FormControl>
              <FormControlLabel control={<Checkbox
                onChange={onChangeVeg}

                inputProps={{ 'aria-label': 'controlled' }}
              />} label="Veg" />
            </Grid>

            <Button onClick={handleFilters}>
              ADD
            </Button>
          </List>
        </Grid>
        <Grid item xs={12} md={9} lg={9}>
          <Paper>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell> Sr No.</TableCell>
                  <TableCell> Item</TableCell>
                  <TableCell>
                    {" "}
                    <Button onClick={sortPriceChange}>
                      {sortName ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
                    </Button>
                    Price
                  </TableCell>
                  <TableCell>
                    {" "}
                    <Button onClick={sortRatingChange}>
                      {sortRate ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
                    </Button>
                    Rating</TableCell>
                  <TableCell>Veg</TableCell>
                  <TableCell>Shop</TableCell>
                  <TableCell> Add ON</TableCell>
                  <TableCell>Quantity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items && items.map((item, ind) => (
                  <TableRow key={ind}>
                    <TableCell>{ind}</TableCell>
                    <TableCell>{item.item.name}</TableCell>
                    <TableCell>{item.item.price}</TableCell>
                    <TableCell>{item.item.rating}</TableCell>
                    <TableCell>{(item.item.isVeg) ? "Yes" : "No"}</TableCell>
                    <TableCell>{item.vendor.shopName}</TableCell>
                    <TableCell><FormControl sx={{ m: 1, minWidth: 230 }}>
                      <InputLabel id="demo-simple-select-autowidth-label">Add ON</InputLabel>
                      <Select
                        variant="outlined"
                        value={addOn}
                        onChange={onChangeAddOns}

                        autoWidth
                        label="Add ON"
                      >
                        {item.item.addOn.map((x) => (
                          <MenuItem
                            key={x.name}
                            value={x}

                          >
                            {x.name}(price:{x.price})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    </TableCell>
                    <TableCell><TextField
                      id="standard-basic"
                      label="0"
                      onChange={changeQuantity}
                    /></TableCell>
                    {!(details.buyer && details.buyer.favourites && details.buyer.favourites.indexOf(item.item._id) != -1) && <TableCell>
                      <FavoriteBorderIcon
                        variant="contained"
                        color="primary"
                        onClick={(event) => {
                          handleAddfav(event, item.item);
                        }
                        }
                      />
                    </TableCell>}

                    {(details.buyer && details.buyer.favourites && details.buyer.favourites.indexOf(item.item._id) != -1) && <TableCell><FavoriteIcon
                      variant="contained"
                      color="primary"
                      onClick={(event) => {
                        handleDelfav(event, item.item);
                      }}
                    /></TableCell>}
                    {console.log(item)}
                    <TableCell>
                      <Button variant="contained" onClick={(event) => {
                        handleOrder(event, item);  }}
                        disabled = {
                          (new Date(item.vendor.timing.endTime).getHours()>new Date(item.vendor.timing.startTime).getHours())?
                          !(new Date(Date.now()).getHours()<new Date(item.vendor.timing.endTime).getHours() && new Date(Date.now()).getHours()>new Date(item.vendor.timing.startTime).getHours()):
                          !((new Date(Date.now()).getHours()>new Date(item.vendor.timing.endTime).getHours() && new Date(Date.now()).getHours()>new Date(item.vendor.timing.startTime).getHours())||(new Date(Date.now()).getHours()<new Date(item.vendor.timing.endTime).getHours() && new Date(Date.now()).getHours()<new Date(item.vendor.timing.startTime).getHours()))
                        } 
                      
                      >
                        Order
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default BuyerDashBoard;
