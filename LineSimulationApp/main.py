from website import create_app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True) # 'debug=True' means that the site will auto-update with changes to the code.