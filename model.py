"""Models and database functions for Boba App."""

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class BobaShop(db.Model):
    """Features a boba shop can have"""

    __tablename__ = "bobashops"
    shop_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(100), nullable=False)
    latitude = db.Column(db.Integer, nullable=False)
    longitude = db.Column(db.Integer, nullable=False)
    # Is this representing the total average rating for BobaShop? It doesn't look like you need this
    # because you have created this relationship on the Rating model.
    # rating = db.Column(db.Integer)


class User(db.Model):
    """Users of Boba App"""

    __tablename__ = "users"

    user_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    email = db.Column(db.String(100), nullable=True)
    password = db.Column(db.String(64), nullable=True)

#In later sprint make an owner class


class Rating(db.Model):
    """Rating of boba shop website."""

    __tablename__ = "ratings"

    rating_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    boba_shop_id = db.Column(db.Integer, db.ForeignKey('bobashops.shop_id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    score = db.Column(db.Integer)

    user = db.relationship("User",
                            backref=db.backref("ratings",
                                                order_by=rating_id))

    boba_shop = db.relationship("BobaShop",
                            backref=db.backref("ratings",
                                               order_by=rating_id))




def connect_to_db(app):
    """Connect the database to our Flask app."""

    # Configure to use our PstgreSQL database
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///boba-app'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.app = app
    db.init_app(app)


if __name__ == "__main__":
    # As a convenience, if we run this module interactively, it will leave
    # you in a state of being able to work with the database directly.

    from server import app
    connect_to_db(app)
    print("Connected to DB.")
