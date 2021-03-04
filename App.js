import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View, Dimensions, SafeAreaView, ActivityIndicator } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import generate from 'promptpay-qr'
import { RFValue } from 'react-native-responsive-fontsize';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get("window")

const prefix = "PromptGen"


export default function App() {
  const [account, setAccount] = useState("")
  const [amount, setAmount] = useState("0")
  const [loading, setLoading] = useState(true)

  const getAsync = async () => {
    try {
      return await AsyncStorage.getItem(`${prefix}:account`)
    } catch (error) {
      console.error(error)
    }
  }

  const setAsync = async () => {
    try {
      await AsyncStorage.setItem(`${prefix}:account`, account)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    (async () => {
      const acc = await getAsync()
      setAccount(acc || "")
      setLoading(false)
    })();
  }, [])

  useEffect(() => {
    setAsync()
  }, [account])

  const handleGenerate = () => {
    return generate(account, { amount: ~~amount })
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar />
      <KeyboardAwareScrollView
        extraHeight={RFValue(30)}
        contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

        <Text style={{ fontSize: RFValue(24) }}>สร้าง QR Code Promptpay</Text>

        <View style={{ marginVertical: RFValue(20), height: RFValue(200) }}>
          {
            loading
              ? <ActivityIndicator />
              : <QRCode size={RFValue(200)} value={handleGenerate()} />
          }
        </View>

        <View>
          <View>
            <Text style={{ marginVertical: RFValue(10) }}>เบอร์โทร หรือเลขบัญชี Promptpay</Text>
            <TextInput
              onChangeText={txt => setAccount(txt)}
              value={account}
              style={[styles.input, styles.shadow]}
              placeholder="0x-xxxx-xxxx" />
          </View>

          <View style={{ marginBottom: RFValue(20) }}>
            <Text style={{ marginVertical: RFValue(10) }}>จำนวนเงิน</Text>
            <TextInput
              onChangeText={txt => setAmount(txt)}
              value={amount}
              style={[styles.input, styles.shadow]}
              placeholder="0.00" />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
    flex: 1
  },

  input: {
    fontSize: RFValue(16),
    paddingHorizontal: RFValue(12),
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "lightgrey",
    width: width * 0.8,
    borderRadius: 8,
    backgroundColor: "#fff"
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  }
});
