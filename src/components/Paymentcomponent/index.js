import React from 'react';
import {StyleSheet, View, Modal, Text} from 'react-native';
import {WebView} from 'react-native-webview';

// import styles from './styles';

class Paymentcomponent extends React.Component {
  constructor(props) {
    super(props);
    this.myWebView;
    this.state = {
      response: '',
    };
  }



  render() {
    const getMagicResponse2 = (resp) => {
            if (resp.status === 'success') {
                //do whatever u want
            }
          }

          function onMessage(data) {
            getMagicResponse(data.nativeEvent.data);
            setvisible(false);
          }
    const {
      visible,
      setvisible,
      getMagicResponse,
      paymenttype,
      paymentOptions: {amount, productinfo, firstname, lastname, email, phone,txnid,key,surl,furl},
    } = this.props;
    const runFirst = `
            document.getElementById("amount").value = '${amount}';
            document.getElementById("firstname").value = '${firstname}';
            document.getElementById("lastname").value = '${lastname}';
            document.getElementById("email").value = '${email}';
            document.getElementById("phone").value = '${phone}';
            document.getElementById("productinfo").value = '${productinfo}';
            document.getElementById("txnid").value = '${txnid}';
            document.getElementById("key").value = '${key}';
            document.getElementById("surl").value = '${surl}';
            document.getElementById("furl").value = '${furl}';
            document.getElementById("paymenttype").value = '${paymenttype}';


            setTimeout(() => {
              document.forms.payuForm.submit();
            }, 200);
          `;

    return (
        <View>
            <Text>Hey</Text>
      <Modal
        animationType={'slide'}
        visible={visible}
        onRequestClose={() => {}}>
        <View style={{ marginTop: 20,backgroundColor : 'yellow' ,height : '100%',width : '100%',marginTop : 60}}>
        {/* <WebView
        originWhitelist={['*']}
        source={{ html: '<h1>Hello world</h1>' }}
        style={{ marginTop: 20,backgroundColor : 'yellow' ,height : '100%',width : '100%'}}
      /> */}
          <WebView
            ref={el => (this.myWebView = el)}
            startInLoadingState={true}
            useWebKit={false}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            scalesPageToFit={true}
            automaticallyAdjustContentInsets={true}
            injectedJavaScript={runFirst}
            
            onMessage={onMessage}
            source={{
              uri: 'http://schizoid.co.in/payment/payment.php?amount='+amount+'&firstname='+firstname+'&lastname='+lastname+'&email='+email+'&phone='+phone+'&productinfo='+productinfo+'&txnid='+txnid+'&key='+key+'&surl='+surl+'&furl='+furl+'&paymenttype='+paymenttype
            }}
          />
        </View>
      </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      paddingHorizontal : 15,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      height : '100%'
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2
    },
    buttonOpen: {
      backgroundColor: "#F194FF",
    },
    buttonClose: {
      backgroundColor: "#E61C52",
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center"
    }
  });

export default Paymentcomponent;
