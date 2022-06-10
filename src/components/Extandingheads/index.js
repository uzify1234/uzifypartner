// Example of Expandable ListView in React Native
// https://aboutreact.com/expandable-list-view/

// Import React
import React, {useEffect, useState} from 'react';
// Import required components
import {
  SafeAreaView,
  LayoutAnimation,
  StyleSheet,
  View,
  Text,
  ScrollView,
  UIManager,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Customtext from '../Customtext';

const ExpandableComponent = ({item, onClickFunction,content, selectedpincodes,setselectedpincodes , allavailablepincodes}) => {
  //Custom Component for the Expandable List
  const [layoutHeight, setLayoutHeight] = useState(0);

  useEffect(() => {
    if (item.isExpanded) {
      setLayoutHeight(null);
    } else {
      setLayoutHeight(0);
    }

  }, [item.isExpanded]);

  return (
    <View>
      {/*Header of the Expandable List Item*/}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onClickFunction}
        style={styles.header}>
        <Customtext type='light' style={styles.headerText}>
          {item.cityname} 
        </Customtext>
      </TouchableOpacity>
      <View
        style={{
          height: layoutHeight,
          overflow: 'hidden',
        }}>
        {/*Content under the header of the Expandable List Item*/}
        {item.subCategory.map((inneritem, key) => (
          <TouchableOpacity
            key={inneritem.name}
            style={styles.content}
            onPress={
              () => {
                  var copy = selectedpincodes;
                  var gf = selectedpincodes.filter(eg => eg.id == item.id );
                  if(gf.length == 0) {
                    var x = {
                        "id": inneritem.id,
                        "name": inneritem.id
                    }
                    var y = {
                        "categoryName": item.categoryName,
                        "id": item.id,
                        "subCategory":[
                           x
                        ]
                             
                    }
                    copy.push(y);
                    setselectedpincodes(y);
                  } 
                  else {
                    var hf = selectedpincodes.filter(eg => eg.id == item.id );
                    var hhf = hf[0].subCategory.filter(hj => hj.id == inneritem.id);
                    if(hhf.length > 0) {
                        var copy = selectedpincodes.filter(eg => eg.id == item.id );
                        var collect = [];
                        var innercopy = selectedpincodes.filter(eg => eg.id == item.id )[0].subCategory;
                        innercopy.map(einf => {
                            if(einf.id !== inneritem.id) {
                                collect.push(einf);
                            }
                        })
                        copy[0].subCategory = collect;
                        setselectedpincodes(copy);


                    }
                    else {
                        var copy = selectedpincodes.filter(eg => eg.id == item.id );
                        var innercopy = selectedpincodes.filter(eg => eg.id == item.id )[0].subCategory;
                        var x = {
                            "id": inneritem.id,
                            "name": inneritem.id
                        }
                        innercopy.push(x);
                        copy[0].subCategory = innercopy;
                        setselectedpincodes(copy);
                       
                    }

                  }
                    
                  
              }
            
          }>
            <Customtext type='light' style={styles.text}>
              {key}. {inneritem.name}
            </Customtext>
            <View style={styles.separator} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const App = ({content, selectedpincodes,setselectedpincodes , allavailablepincodes}) => {
  const [listDataSource, setListDataSource] = useState(content);
  const [multiSelect, setMultiSelect] = useState(true);

  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }


  const updateLayout = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const array = [...listDataSource];
    if (multiSelect) {
      // If multiple select is enabled
      array[index]['isExpanded'] = !array[index]['isExpanded'];
    } else {
      // If single select is enabled
      array.map((value, placeindex) =>
        placeindex === index
          ? (array[placeindex]['isExpanded'] =
             !array[placeindex]['isExpanded'])
          : (array[placeindex]['isExpanded'] = false),
      );
    }
    setListDataSource(array);
  };

  return (
    
      <View style={styles.container}>
         
        <View style={{flexDirection: 'row', padding: 10}}>
   
        </View>
        
          {listDataSource.map((item, key) => (
            <ExpandableComponent
              key={item.categoryName}
              onClickFunction={() => {
                updateLayout(key);
              }}
              item={item}
              content={content} selectedpincodes={selectedpincodes} setselectedpincodes={setselectedpincodes} allavailablepincodes={allavailablepincodes}
            />
          ))}
        
      </View>
      
   
  );
};

export default App;
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    marginBottom : 100
  },
  titleText: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: '#F5FCFF',
    padding: 20,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '500',
  },
  separator: {
    height: 0.5,
    backgroundColor: '#808080',
    width: '95%',
    marginLeft: 16,
    marginRight: 16,
  },
  text: {
    fontSize: 16,
    color: '#606070',
    padding: 10,
  },
  content: {
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#fff',
  },
});

//Dummy content to show
//You can also use dynamic data by calling webservice
const CONTENT2 = [
  {
    isExpanded: false,
    category_name: 'Item 1',
    subcategory: [
      {id: 1, val: 'Sub Cat 1'},
      {id: 3, val: 'Sub Cat 3'},
    ],
  },
  {
    isExpanded: false,
    category_name: 'Item 2',
    subcategory: [
      {id: 4, val: 'Sub Cat 4'},
      {id: 5, val: 'Sub Cat 5'},
    ],
  },
  {
    isExpanded: false,
    category_name: 'Item 3',
    subcategory: [
      {id: 7, val: 'Sub Cat 7'},
      {id: 9, val: 'Sub Cat 9'},
    ],
  },
  {
    isExpanded: false,
    category_name: 'Item 4',
    subcategory: [
      {id: 10, val: 'Sub Cat 10'},
      {id: 12, val: 'Sub Cat 2'},
    ],
  },
  {
    isExpanded: false,
    category_name: 'Item 5',
    subcategory: [
      {id: 13, val: 'Sub Cat 13'},
      {id: 15, val: 'Sub Cat 5'},
    ],
  },
  {
    isExpanded: false,
    category_name: 'Item 6',
    subcategory: [
      {id: 17, val: 'Sub Cat 17'},
      {id: 18, val: 'Sub Cat 8'},
    ],
  },
  {
    isExpanded: false,
    category_name: 'Item 7',
    subcategory: [{id: 20, val: 'Sub Cat 20'}],
  },
  {
    isExpanded: false,
    category_name: 'Item 8',
    subcategory: [{id: 22, val: 'Sub Cat 22'}],
  },
  {
    isExpanded: false,
    category_name: 'Item 9',
    subcategory: [
      {id: 26, val: 'Sub Cat 26'},
      {id: 27, val: 'Sub Cat 7'},
    ],
  },
  {
    isExpanded: false,
    category_name: 'Item 10',
    subcategory: [
      {id: 28, val: 'Sub Cat 28'},
      {id: 30, val: 'Sub Cat 0'},
    ],
  },
  {
    isExpanded: false,
    category_name: 'Item 11',
    subcategory: [{id: 31, val: 'Sub Cat 31'}],
  },
  {
    isExpanded: false,
    category_name: 'Item 12',
    subcategory: [{id: 34, val: 'Sub Cat 34'}],
  },
  {
    isExpanded: false,
    category_name: 'Item 13',
    subcategory: [
      {id: 38, val: 'Sub Cat 38'},
      {id: 39, val: 'Sub Cat 9'},
    ],
  },
  {
    isExpanded: false,
    category_name: 'Item 14',
    subcategory: [
      {id: 40, val: 'Sub Cat 40'},
      {id: 42, val: 'Sub Cat 2'},
    ],
  },
  {
    isExpanded: false,
    category_name: 'Item 15',
    subcategory: [
      {id: 43, val: 'Sub Cat 43'},
      {id: 44, val: 'Sub Cat 44'},
    ],
  },
];