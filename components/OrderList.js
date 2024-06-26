import {
  FlatList,
  StyleSheet,
  View,
} from "react-native";
import React, { useEffect, useState , forwardRef  } from "react";
import OrderCard from "./OrderCard";

const OrderList = forwardRef(({ itemsData, buttons, buttonPress }, ref) => {
  
  const [listItems, setListItems] = useState([]);
  
  // 모든 주문 리스트는 일단 날짜,시간 순으로 정렬!!
  useEffect(() => {
    // itemsData를 날짜 기준으로 정렬
    const sortedItems = itemsData.slice().sort((a, b) => {
      const dateA = new Date(a.SDDate);
      const dateB = new Date(b.SDDate);

      // 날짜가 같으면 STSeq를 비교하여 정렬
      if (dateA.getTime() === dateB.getTime()) {
        return a.STSeq - b.STSeq;
      }

      // 날짜가 다르면 날짜를 기준으로 정렬
      return dateA.getTime() - dateB.getTime();
    });

    setListItems(sortedItems);
  }, [itemsData]);

  const handleOnPress = (data) => {
    buttonPress(data);
  };

  return (
    <View>
      <FlatList
        ref={ref}
        data={listItems} // 수정된 listItems를 사용
        renderItem={({ item }) => (
          <OrderCard
            STSeq={item.STSeq}
            OrderKey={item.OrderKey}
            UserName={item.UserName}
            UserHp={item.UserHp}
            Details={item.Details}
            ProcessCode={item.ProcessCode}
            onPress={handleOnPress}
            buttons={buttons}
            SDDate={item.SDDate}
            SDTime={item.SDTime}
            declineReason={item.declineReason}
            cancellationReason={item.cancellationReason}
            />
        )}
        keyExtractor={(item) => item.OrderKey.toString()} //고유키 추출 
      />
    </View>
  );
});

export default OrderList;

const styles = StyleSheet.create({});
