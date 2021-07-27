/* eslint-disable no-unused-vars */
import ConsulIcon from "../icons/ConsulIcon.js"
import OpenServiceMeshIcon from "../icons/OpenServiceMeshIcon.js"
import LinkerdIcon from "../icons/LinkerdIcon.js"
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import ServiceMeshConfig from "../ConfigComponents/ServiceMesh"
import ServiceCard from "../ServiceCard"
import {Grid} from "@material-ui/core"
import VerticalCarousel from "../../VerticalCarousel/VerticalCarousel"
import ServiceMeshDataPanel from "../DataPanels/ServiceMesh"
import {useEffect, useState} from "react"
import {fetchAvailableAdapters} from "../helpers/serviceMeshes"
import { updateProgress } from "../../../lib/store.js";

const ServiceMeshScreen = ({meshAdapters, meshAdaptersts, updateProgress}) => {



  const [availableAdapters, setAvailableAdapters] = useState([])
  const [activeAdapters, setActiveAdapters] = useState(meshAdapters)

  const serviceMeshComponents = availableAdapters.map(adapter => ({
    name: adapter.name ? adapter.name : adapter.label.split(":")[0],
    logoComponent:  OpenServiceMeshIcon,
    configComp :  <ServiceMeshConfig adapterLoc={adapter.value}/>,
    adapterInfo: adapter
  }))

  const isAdapterActive = (adapterLoc) => {
    let isActive = false
    activeAdapters.forEach(adapter => {
      if(adapter.adapter_location === adapterLoc) isActive = true
    }) 
    return isActive
  }


  const [activeIndex, setActiveIndex] = useState(0);

  const itemsToBeRendered = serviceMeshComponents.map(comp => {
    return(
        <ServiceCard serviceInfo={comp} isConnected={isAdapterActive(comp.adapterInfo.value)} /> 
    ) 
  })

  const itemToDisplay = (items, curIndex) => {
    return  items[curIndex] ? items[curIndex] : null
  }


  useEffect(() => {
    fetchAvailableAdapters()
      .then(res => {
        setAvailableAdapters( res)
      })
      .catch( err => alert(err))
  },[meshAdapters])

  useEffect(() => {
    setActiveAdapters(meshAdapters) 
  }, [meshAdapters])



  return (
    <Grid xs={12} container justify="center" alignItems="flex-start">
      <Grid item xs={6} container justify="flex-start" >
        <VerticalCarousel item=
          {itemToDisplay(itemsToBeRendered, activeIndex)} setActiveIndex={setActiveIndex}/>
      </Grid>
      <Grid item xs={6} container justify="center">
        <ServiceMeshDataPanel adapterInfo={itemToDisplay(serviceMeshComponents, activeIndex)?.adapterInfo} isActive={isAdapterActive(itemToDisplay(serviceMeshComponents, activeIndex)?.adapterInfo.value)}  />
      </Grid>
    </Grid>
  )
}

const mapDispatchToProps = (dispatch) => ({
  updateProgress: bindActionCreators(updateProgress, dispatch),
});

const mapStateToProps = (state) => {
  const meshAdapters = state.get("meshAdapters").toJS();
  const meshAdaptersts = state.get("meshAdaptersts");
  return {
    meshAdapters,
    meshAdaptersts,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ServiceMeshScreen)

