import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import "./TabsDetail.css";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      className="tab_info"
      {...other}
    >
      {value === index && (
        <Box sx={{ padding: "0 25px" }}>
          {/* <Typography>{children}</Typography> */}
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const TabsDetail = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: "background.paper",
        display: "flex",
        justifyContent: "space-between",
        paddingLeft: "20px",
        paddingRight: "20px",
        marginTop: "30px",
        marginBottom: "30px",
        minHeight: "250px",
        // height: 224,
      }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: "divider" }}
      >
        <Tab label="Tổng quan" {...a11yProps(0)} />
        <Tab label="Tiện nghi" {...a11yProps(1)} />
        <Tab label="FAQ" {...a11yProps(2)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <div className="tab_info_wrapper">
          <div className="tab_info_top">
            <p>
              It is a long established fact that a reader will be distracted by
              the readable content of a page when looking at its layout. The
              point of using Lorem Ipsum is that it has a more-or-less normal
              distribution of letters, as opposed to using 'Content here,
              content here', making it look like readable English.
            </p>
          </div>
          <div className="tab_info_bottom">
            <div className="tab_info_bottom_item">
              <h4>Thong tin</h4>
              <ul>
                <li>So luong: 4 nguoi</li>
                <li>Dien tich: 108m2</li>
                <li>Huong nhin: Truc dien bien</li>
                <li>Loai giuong: double</li>
              </ul>
            </div>
            <div className="tab_info_bottom_item">
              <h4>Dac biet</h4>
              <ul>
                <li>Fitness</li>
                <li>Ho boi</li>
                <li>Giat ui</li>
              </ul>
            </div>
            <div className="tab_info_bottom_item">
              <h4>Dich vu khac</h4>
              <ul>
                <li>spa</li>
                <li>fitness</li>
                <li>nha hang</li>
                <li>quay bar</li>
              </ul>
            </div>
          </div>
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
    </Box>
  );
};

export default TabsDetail;
