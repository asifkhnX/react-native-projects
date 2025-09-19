import React, { useState } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';

// Local imports
import { FILE_PATH } from '../../ApiPath';

const { width } = Dimensions.get('window');

const NewsCarousel = ({ allNews }) => {

    const [activeIndex, setActiveIndex] = useState(0);
    console.log(allNews);

    const renderItem = ({ item, index }) => {
        return(
            <View>
                <View style={styles.cardImageContainer}>
                    <Image source={{ uri: `${FILE_PATH}/${item.file}` }} alt="card-image" style={styles.cardImage} />
                </View>
            </View>
        );
    }

    return (
        <View>
            <Carousel
                data={allNews}
                renderItem={renderItem}
                sliderWidth={width}
                itemWidth={width}
                loop={true}
                autoplay={true}
                autoplayInterval={3000}
                containerCustomStyle={styles.carouselContainer}
                onSnapToItem={(index) => setActiveIndex(index)}
            />
            <Pagination
                dotsLength={allNews.length}
                activeDotIndex={activeIndex}
                containerStyle={styles.paginationContainer}
                dotStyle={styles.paginationDot}
                inactiveDotStyle={styles.inactivePaginationDot}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.8}
            />
        </View>
        
    );

};

export default NewsCarousel;

const styles = StyleSheet.create({

    carouselContainer: {
        flexGrow: 0,
    },
    paginationContainer: {
        paddingTop: 5,
    },
    paginationDot: {
        width: 8,
        height: 8,
        paddingBottom: 0,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
    },
    inactivePaginationDot: {
        width: 8,
        height: 8,
    },
    cardImageContainer: {
        width: '100%',
        padding: 15,
    },
    cardImage: {
        width: '100%',
        height: width,
        resizeMode: "cover",
        borderRadius: 10,
    },
});
