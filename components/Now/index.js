Component({
  properties: {
    weather: {
      type:Object,
      observer: function(data) {
        this.handleFormData(data);
      }
    }
  },
  methods: {
    handleFormData({ daily, hourly }) {
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
  }
})
