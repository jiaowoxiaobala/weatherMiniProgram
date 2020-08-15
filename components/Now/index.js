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
    handleFormData({ now, daily, hourly, life }) {
      console.log(daily, '!!!!!!!!!!!!!!')
      this.setData({
        today: daily[0],
        tomorrow: daily[1],
        days: daily,
        hourly,
        now,
        life
      });
    },
    handleSpread() {
      this.setData({
        isSpread: !this.data.isSpread
      })
    }
  }
})
