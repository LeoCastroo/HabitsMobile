import { useState, useEffect } from 'react'
import { View, Text, ScrollView, Alert } from "react-native";

import { api } from '../lib/axios'
import { generateRangeDatesFromYearStart } from "../utils/generate-range-between-dates";

import { HabitDay, DAY_SIZE } from "../components/HabitDay";
import { Header } from "../components/Header";
import { useNavigation } from "@react-navigation/native";

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const datesFromYearStart = generateRangeDatesFromYearStart();
const minimumSummurayDatesSize = 18 * 5;
const amountofDaystoFill = minimumSummurayDatesSize - datesFromYearStart.length;

export function Home() {

    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState(null)

    const { navigate } = useNavigation();
    
    async function fetchData(){

        try{
            setLoading(true);
            const response = await api.get('/summary');
            console.log(response.data)
            setSummary(response.data)

        }catch(e){
            Alert.alert('Ops', 'Não foi possível carregar o sumário de dados')
            console.log(e)
        } finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData();
    }, [])
    
    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <Header />
            <View
                className="flex-row mt-6 mb-2"
            >
                {
                    weekDays.map((weekDay, i) => (
                        <Text key={`${weekDay}-${i}`}
                            className="text-zinc-400 text-xl font-bold text-center mx-1"
                            style={{ width: DAY_SIZE }}
                        >
                            {weekDay}
                        </Text>
                    ))
                }
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 100}}
            >
                <View className="flex-row flex-wrap">

                    {
                        datesFromYearStart.map((date) => (
                            <HabitDay
                                key={date.toISOString()}
                                onPress={() => navigate('habit', { date: date.toISOString()})}
                            />
                        ))
                    }
                    {
                        amountofDaystoFill > 0 && Array
                            .from({ length: amountofDaystoFill })
                            .map((_, index) => (
                                <View
                                    key={index}
                                    className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                                    style={{ width: DAY_SIZE, height: DAY_SIZE }}
                                />
                            ))
                    }
                </View>
            </ScrollView>

        </View >
    )
}
