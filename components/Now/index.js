Component({
  properties: {
    weather: {
      type:Object,
      observer: function(data) {
        console.log(data, '~~~~~~~~~~`')
        this.handleFormData(data);
      }
    }
  },
  methods: {
    handleFormData({ daily, hourly }) {
      console.log(hourly, '~~~~~~~~')
      console.log(daily, '~~~~~~~~')
      this.setData({
        today: daily[0],
        tomorrow: daily[1],
        days: daily,
        hourly
      });
    },
    handleSpread() {
      this.setData({
        isSpread: !this.data.isSpread
      })
    }
  },
  data: {
    isSpread: false
  }
})
