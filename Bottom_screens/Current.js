import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Modal,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OrderList from "../components/OrderList";
import { useDispatch, useSelector } from "react-redux";
import { onReady, onCancel } from "../store/storeSlice";
import EmptyOrders from "../components/EmptyOrders";
import Length from "../RightUpBar/Length";
import { Ionicons } from "@expo/vector-icons";

const Current = ({ navigation }) => {
  const dispatch = useDispatch(); // Redux의 useDispatch를 사용하여 액션을 디스패치
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const currentOrders = useSelector((state) => state.OrdersDistrubutionSlice.current); // Redux에서 상태를 가져오기 위해 useSelector를 사용
  const [orders, setOrders] = useState([]); // 로컬 상태 orders를 사용하여 currentOrders를 업데이트
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selctedAction, setSelctedAction] = useState(null);
  const [selctedOrderKey, setSelctedOrderKey] = useState(null);
  const scrollViewRef = useRef(null); // 스크롤 위치를 조작할 때 사용됩니다.

  // currentOrders가 업데이트될 때마다 orders를 업데이트
  useEffect(() => {
    setOrders(currentOrders);
  }, [currentOrders]); // 'currentOrders'의 변화에만 반응하도록 설정

  useEffect(() => {
    if (!isLoggedIn) {
      navigation.navigate("Login");
    }
  }, [isLoggedIn]);

  // 버튼 클릭할때 이벤트!! (준비완료 , 주문취소)
  const buttonPress = async (data) => {
    console.log("접수완료에서 data 객체:", data); // data 객체의 내용을 콘솔에 출력
    if (data.action === "준비완료") {
      try {
        // API 요청
        const response = await fetch(
          "http://211.54.171.41:3000/api/order/orderProcessUpdateforAdmin",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              OrderKey: data.OrderKey, // 주문 키 동적 할당
              ProcessCode: "D",
            }),
          }
        );

        const result = await response.json();

        // 응답 로그 출력
        console.log("API 응답:", result);

        // 응답 코드 확인
        if (result.res_cd === "00") {
          // 성공 응답 처리
          console.log("성공:", result.res_msg);
          dispatch(onReady({ STSeq: data.STSeq, res_cd: result.res_cd }));
          // 필요한 추가 처리 작성
        } else {
          // 실패 응답 처리
          console.error("실패:", result.res_msg);
          // 필요한 에러 처리 작성
        }
      } catch (error) {
        console.error("API 요청 중 오류 발생:", error);
        // 네트워크 에러 처리
      }
    } else if (data.action === "주문취소") {
      setSelectedOrderId(data.STSeq); // 주문번호를 selectedOrderId에 할당
      setSelctedAction(data.action);
      setSelctedOrderKey(data.OrderKey);
      setIsModalVisible(true);
    }
  };

  // 주문 취소 사유를 소켓으로 전달!
  const handleCancelReason = async (reason) => {
    // console.log(selectedOrderId, selctedAction, selctedOrderKey);

    // 취소 사유에 따라 CancleCode 결정
    let cancleCode;
    if (reason === "고객 변심") {
      cancleCode = "A";
    } else if (reason === "판매 상품 품절") {
      cancleCode = "B";
    } else if (reason === "기타") {
      cancleCode = "C";
    }

    try {
      // API 요청
      const response = await fetch(
        "http://211.54.171.41:3000/api/order/orderProcessUpdateforAdmin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            OrderKey: selctedOrderKey, // 주문 키 동적 할당
            ProcessCode: "V", // 취소는 무조건 "V"
            CancleCode: cancleCode, // 조건에 따라 결정된 CancleCode 사용
          }),
        }
      );

      const result = await response.json();
      console.log("API 응답:", result);

      // 응답 코드 확인 후 처리
      if (result.res_cd === "00") {
        console.log("성공:", result.res_msg);
        console.log(
          "디스패치에 쓰이는 값 !!!",
          selectedOrderId,
          result.res_cd,
          reason
        ); //  44 00 고객 요청에 따른 취소
        dispatch(
          onCancel({
            STSeq: selectedOrderId,
            res_cd: result.res_cd,
            cancellationReason: reason,
          })
        );
      } else {
        console.error("실패:", result.res_msg);
        // 필요한 에러 처리 작성
      }
    } catch (error) {
      console.log(selectedOrderId, result.res_cd, reason);
      console.error("API 요청 중 오류 발생:", error);
      // 네트워크 에러 처리 작성
    } finally {
      setIsModalVisible(false); // 성공/실패 여부와 관계없이 모달 닫기
    }
  };

  // 스크롤 내리는 함수 정의
  const scrollToBottom = () => {
    scrollViewRef.current.scrollToEnd({ animated: true });
    // console.log("아래로 이동합니다!");
  };

  // 스크롤 위로 이동하는 함수
  const scrollToTop = () => {
    scrollViewRef.current.scrollToOffset({ animated: true, offset: 0 });
  };


  return (
    <View style={styles.container}>
      {isLoggedIn ? (
        <>
          {/* 주문이 없는 경우 EmptyOrders 컴포넌트를 표시 */}
          {orders.length === 0 && <EmptyOrders name="Current" />}
          {/* OrdersNumbers 컴포넌트를 사용하여 주문 개수를 표시 */}
          <Length length={orders.length} />
          {/* 주문 목록을 표시하는 OrderList 컴포넌트 */}
          <SafeAreaView style={{ flex: 1 }}>
              <OrderList
                ref={scrollViewRef}
                buttons={["준비완료", "주문취소"]}
                itemsData={orders}
                buttonPress={buttonPress}
              />
          </SafeAreaView>

          {/* up-down 버튼! */}
          <View style={styles.buttonContainer}>
            {/* 위로 이동하는 버튼 */}
            <TouchableOpacity
              style={styles.scrollToTopButton}
              onPress={scrollToTop}
            >
              <Ionicons name="arrow-up" size={24} color="white" />
            </TouchableOpacity>

            {/* 아래로 이동하는 버튼 */}
            <TouchableOpacity
              style={styles.scrollToBottomButton}
              onPress={scrollToBottom}
            >
              <Ionicons name="arrow-down" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </>
      ) : null}

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>주문 취소 사유를 선택해주세요</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleCancelReason("고객 변심")}
            >
              <Text style={styles.textStyle}>고객 변심</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleCancelReason("판매 상품 품절")}
            >
              <Text style={styles.textStyle}>판매 상품 품절</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleCancelReason("기타")}
            >
              <Text style={styles.textStyle}>기타</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.textStyle}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#AFA8BA",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#694fad",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },

  buttonContainer: {
    flexDirection: "column", // column으로 변경하여 수직으로 배치
    alignItems: "center", // 가운데 정렬
    position: "absolute",
    bottom: 20,
    right: 20,
  },

  scrollToTopButton: {
    backgroundColor: "skyblue",
    padding: 7,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  scrollToBottomButton: {
    backgroundColor: "skyblue",
    padding: 7,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Current;
